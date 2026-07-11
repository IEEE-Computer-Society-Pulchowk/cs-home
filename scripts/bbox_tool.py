#!/usr/bin/env python3
"""
Simple Certificate Bounding Box Tool - Click and drag to get x,y,width,height on an SVG background.
Outputs coordinates to stdout.
"""
import tkinter as tk
from tkinter import filedialog, messagebox
from pathlib import Path
from PIL import Image, ImageTk, ImageDraw
import io
import sys

try:
    import cairosvg
    HAS_CAIROSVG = True
except ImportError:
    HAS_CAIROSVG = False


class BoundingBoxTool:
    def __init__(self, root, svg_path, viewbox_width, viewbox_height):
        self.root = root
        self.root.title(f"Bounding Box Tool - {Path(svg_path).name}")
        self.root.geometry("1200x800")

        self.svg_path = svg_path
        self.viewbox_width = viewbox_width
        self.viewbox_height = viewbox_height

        self.original_image = None
        self.display_image = None
        self.tk_image = None
        self.scale = 1.0

        self.drag_start = None
        self.current_rect = None
        self.rectangles = []

        self.setup_ui()
        self.load_svg()

    def setup_ui(self):
        toolbar = tk.Frame(self.root)
        toolbar.pack(side=tk.TOP, fill=tk.X, padx=5, pady=5)

        tk.Label(toolbar, text="Click and drag to create bounding box. Coordinates printed to console.").pack(side=tk.LEFT, padx=10)
        tk.Button(toolbar, text="Clear", command=self.clear_rectangles).pack(side=tk.RIGHT, padx=5)
        tk.Button(toolbar, text="Copy Last", command=self.copy_last).pack(side=tk.RIGHT, padx=5)

        self.canvas = tk.Canvas(self.root, bg="#ccc", cursor="cross")
        self.canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<B1-Motion>", self.on_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_release)

        self.coord_label = tk.Label(self.root, text="x: 0, y: 0, w: 0, h: 0", font=("Monospace", 12), fg="#333")
        self.coord_label.pack(side=tk.BOTTOM, anchor=tk.W, padx=10, pady=5)

    def load_svg(self):
        if HAS_CAIROSVG:
            try:
                png_data = cairosvg.svg2png(url=self.svg_path, output_width=self.viewbox_width, output_height=self.viewbox_height)
                self.original_image = Image.open(io.BytesIO(png_data)).convert("RGBA")
                self.update_display()
                return
            except Exception as e:
                print(f"cairosvg failed: {e}")

        # Fallback: create placeholder with SVG path as text
        self.original_image = Image.new("RGBA", (self.viewbox_width, self.viewbox_height), (240, 240, 240, 255))
        draw = ImageDraw.Draw(self.original_image)
        try:
            draw.text((20, 20), f"SVG: {Path(self.svg_path).name}\n(cairosvg not installed - placeholder)", fill=(100, 100, 100))
        except Exception:
            pass
        self.update_display()

    def update_display(self):
        if not self.original_image:
            return

        canvas_w = self.canvas.winfo_width()
        canvas_h = self.canvas.winfo_height()
        if canvas_w < 10 or canvas_h < 10:
            self.root.after(100, self.update_display)
            return

        img_w, img_h = self.original_image.size
        scale_w = canvas_w / img_w
        scale_h = canvas_h / img_h
        self.scale = min(scale_w, scale_h, 1.0)

        new_w = int(img_w * self.scale)
        new_h = int(img_h * self.scale)
        self.display_image = self.original_image.resize((new_w, new_h), Image.Resampling.LANCZOS)
        self.tk_image = ImageTk.PhotoImage(self.display_image)

        self.canvas.delete("bg")
        self.canvas.create_image(
            (canvas_w - new_w) // 2, (canvas_h - new_h) // 2,
            image=self.tk_image, anchor=tk.NW, tags="bg"
        )

        self.redraw_rectangles()

    def canvas_to_image_coords(self, x, y):
        if not self.display_image:
            return x, y
        canvas_w = self.canvas.winfo_width()
        canvas_h = self.canvas.winfo_height()
        img_w, img_h = self.display_image.size
        offset_x = (canvas_w - img_w) // 2
        offset_y = (canvas_h - img_h) // 2
        ix = (x - offset_x) / self.scale
        iy = (y - offset_y) / self.scale
        return max(0, min(ix, self.viewbox_width)), max(0, min(iy, self.viewbox_height))

    def image_to_canvas_coords(self, x, y):
        if not self.display_image:
            return x, y
        canvas_w = self.canvas.winfo_width()
        canvas_h = self.canvas.winfo_height()
        img_w, img_h = self.display_image.size
        offset_x = (canvas_w - img_w) // 2
        offset_y = (canvas_h - img_h) // 2
        cx = offset_x + x * self.scale
        cy = offset_y + y * self.scale
        return cx, cy

    def on_click(self, event):
        ix, iy = self.canvas_to_image_coords(event.x, event.y)
        self.drag_start = (ix, iy)
        self.current_rect = None

    def on_drag(self, event):
        if not self.drag_start:
            return
        ix, iy = self.canvas_to_image_coords(event.x, event.y)
        x0, y0 = self.drag_start

        x1 = min(x0, ix)
        y1 = min(y0, iy)
        x2 = max(x0, ix)
        y2 = max(y0, iy)

        w = x2 - x1
        h = y2 - y1

        if self.current_rect:
            self.canvas.delete(self.current_rect)

        cx1, cy1 = self.image_to_canvas_coords(x1, y1)
        cx2, cy2 = self.image_to_canvas_coords(x2, y2)
        self.current_rect = self.canvas.create_rectangle(cx1, cy1, cx2, cy2, outline="red", width=2)

        self.coord_label.config(text=f"x: {round(x1)}, y: {round(y1)}, w: {round(w)}, h: {round(h)}")

    def on_release(self, event):
        if not self.drag_start:
            return
        ix, iy = self.canvas_to_image_coords(event.x, event.y)
        x0, y0 = self.drag_start

        x1 = min(x0, ix)
        y1 = min(y0, iy)
        x2 = max(x0, ix)
        y2 = max(y0, iy)

        w = x2 - x1
        h = y2 - y1

        if w < 5 or h < 5:
            self.drag_start = None
            if self.current_rect:
                self.canvas.delete(self.current_rect)
                self.current_rect = None
            return

        rect = {"x": round(x1), "y": round(y1), "w": round(w), "h": round(h)}
        self.rectangles.append(rect)

        if self.current_rect:
            self.canvas.itemconfig(self.current_rect, outline="blue")
            self.current_rect = None

        print(f'{{"x": {rect["x"]}, "y": {rect["y"]}, "width": {rect["w"]}, "height": {rect["h"]}}}')

        self.drag_start = None

    def redraw_rectangles(self):
        for rect in self.rectangles:
            cx1, cy1 = self.image_to_canvas_coords(rect["x"], rect["y"])
            cx2, cy2 = self.image_to_canvas_coords(rect["x"] + rect["w"], rect["y"] + rect["h"])
            self.canvas.create_rectangle(cx1, cy1, cx2, cy2, outline="blue", width=2)

    def clear_rectangles(self):
        self.rectangles = []
        self.canvas.delete("all")
        self.update_display()

    def copy_last(self):
        if self.rectangles:
            r = self.rectangles[-1]
            text = f'{{"x": {r["x"]}, "y": {r["y"]}, "width": {r["w"]}, "height": {r["h"]}}}'
            self.root.clipboard_clear()
            self.root.clipboard_append(text)
            messagebox.showinfo("Copied", text)


def main():
    # Default values
    svg_path = "/home/asp/Projects/ieeecs/cs-home/public/certificates/templates/demo.svg"
    viewbox_width = 1600
    viewbox_height = 1131

    if len(sys.argv) > 1:
        svg_path = sys.argv[1]
    if len(sys.argv) > 2:
        viewbox_width = int(sys.argv[2])
    if len(sys.argv) > 3:
        viewbox_height = int(sys.argv[3])

    if not Path(svg_path).exists():
        svg_path = filedialog.askopenfilename(
            title="Select SVG background",
            filetypes=[("SVG files", "*.svg"), ("All files", "*.*")],
            initialdir="/home/asp/Projects/ieeecs/cs-home/public/certificates/templates"
        )
        if not svg_path:
            return

    if not HAS_CAIROSVG:
        print("Note: cairosvg not installed. SVG will show as placeholder.")
        print("Install with: pip install cairosvg (or system package python-cairosvg)")

    root = tk.Tk()
    app = BoundingBoxTool(root, svg_path, viewbox_width, viewbox_height)
    root.mainloop()


if __name__ == "__main__":
    main()