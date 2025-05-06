import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

function hashColor(userId) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
  }

  // Limit the color range to dark shades
  const r = ((hash >> 16) & 0xff) / 2; 
  const g = ((hash >> 8) & 0xff) / 2;  
  const b = (hash & 0xff) / 2;         

  const darkColor = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  return darkColor;
}

function createRemoteCursorPlugin(getCursors) {
  return ViewPlugin.fromClass(class {
    constructor(view) {
      this.decorations = this.buildDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    // Build decorations based on the cursors
    buildDecorations(view) {
      const builder = new RangeSetBuilder();
      const cursors = getCursors(); 

      cursors.forEach((cursor, userId) => {
        if (!cursor || cursor.line == null || cursor.col == null) return;

        try {
          const totalLines = view.state.doc.lines;
          if (cursor.line < 0 || cursor.line >= totalLines) return;

          const lineInfo = view.state.doc.line(cursor.line + 1); 
          
          // Validate if the line exists and the position is within the document bounds
          if (lineInfo) {
            const pos = lineInfo.from + cursor.col;
            if (pos <= view.state.doc.length) {
              const deco = Decoration.widget({
                widget: new RemoteCursorWidget(userId),
                side: 1
              });
              builder.add(pos, pos, deco);
            }
          }
        } catch (e) {
          console.warn(`Error placing cursor for ${userId}:`, e);
        }
      });

      return builder.finish();
    }
  }, {
    decorations: v => v.decorations
  });
}

// Widget for remote cursor and username label
class RemoteCursorWidget extends WidgetType {
  constructor(userId) {
    super();
    this.userId = userId;
    this.color = hashColor(userId); 
  }

  toDOM() {
    const wrapper = document.createElement("span");
    wrapper.style.position = "relative";
    wrapper.style.pointerEvents = "none";
    wrapper.style.zIndex = "100"; 
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    
    // Cursor 
    const cursorEl = document.createElement("span");
    cursorEl.textContent = "<";
    cursorEl.style.fontSize = "18px";
    cursorEl.style.fontWeight = "bold";
    cursorEl.style.position = "absolute";
    cursorEl.style.top = "0"; 
    cursorEl.style.left = "0"; 
  
    // Label next to the cursor
    const labelEl = document.createElement("div");
    labelEl.textContent = this.userId;
    labelEl.style.position = "absolute";
    labelEl.style.left = "10px";  
    labelEl.style.top = "0"; 
    labelEl.style.background = "silver";
    labelEl.style.border = "1px solid #ccc";
    labelEl.style.borderRadius = "4px";
    labelEl.style.padding = "2px 6px";
    labelEl.style.fontSize = "12px";
    labelEl.style.fontWeight = "bold";
    labelEl.style.whiteSpace = "nowrap";
    labelEl.style.color = this.color;
    labelEl.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
    labelEl.style.zIndex = "101";
  
    wrapper.appendChild(cursorEl);
    wrapper.appendChild(labelEl);
    return wrapper;
  }
  
  ignoreEvent() {
    return true;
  }
}

export default createRemoteCursorPlugin;
