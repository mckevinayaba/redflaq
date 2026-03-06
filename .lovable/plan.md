

## Problem

The Tawk.to chat widget is:
1. Auto-opening its chat window without user interaction
2. Showing a proactive "We Are Here" popup message
3. Displaying a "1 new message" notification badge above the navbar

All of these are controlled by Tawk.to's API settings.

## Fix

Add `Tawk_API` configuration in `index.html` to suppress all auto-popups:

1. **Set `Tawk_API.onLoad`** callback to:
   - Minimize the widget on load (`Tawk_API.minimize()`)
   - Hide the popup message (`Tawk_API.hideWidget()` is too aggressive — instead use `minimize`)
2. **Set `Tawk_API.customStyle`** to hide the notification badge
3. **Disable proactive chat triggers** by setting `Tawk_API.onBeforeLoad` to prevent auto-popup behaviors:
   - `Tawk_API.visitor` settings won't help — the proactive messages ("We Are Here", auto-open) are configured in the Tawk.to dashboard under **Triggers**
   
### What we can control via code

In `index.html`, before the Tawk script loads, add:

```javascript
Tawk_API.onLoad = function() {
  Tawk_API.minimize();
};
Tawk_API.onChatMessageVisitor = function() {};
Tawk_API.onChatMessageSystem = function() {};
```

And add CSS to hide the unread badge:

```css
/* Hide Tawk notification badge */
.tawk-min-container .tawk-badge {
  display: none !important;
}
```

### What requires Tawk.to dashboard changes

The proactive "We Are Here" message and auto-open behavior are **Triggers** configured in the Tawk.to dashboard (Settings → Triggers). These cannot be fully suppressed from code alone. The `Tawk_API.minimize()` on load will close it if it auto-opens, but the trigger may still fire briefly.

**Recommendation**: Go to your Tawk.to dashboard → Settings → Triggers → disable or delete the proactive greeting trigger. This is the only way to fully stop "We Are Here" and the auto-open.

### Implementation steps

1. Update `index.html`: Add `Tawk_API.onLoad` with `minimize()` call before the embed script
2. Add CSS to hide the notification badge counter
3. These changes will make the widget stay minimized and badge-free until a user explicitly clicks it

