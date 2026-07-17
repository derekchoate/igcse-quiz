/* ================= kit: thread =================
   A two-sided message-thread log: entries pinned left or right (chat-bubble
   style, matching whichever two roles the calling module names), with a
   third "system" lane for events that belong to neither side — rendered as
   a centred italic note with no bubble, the same way a messaging app shows
   "not delivered" rather than pretending it's a message from either person.
   A role label appears above a bubble only when the speaker changes from
   the entry before, so consecutive lines from the same side share one
   label — the same grouping real messaging apps use.

   makeThread(logEl, labels) — labels: {left, right} display text for the
   two role-label headers.
   api: play(steps, opts) — steps: [{text, side, tone}], side one of
   "left"/"right"/"system"; tone is an optional extra class for a system
   note (e.g. flagging one as more alarming than another). opts:
   {reduceMotion, stepDelay=450, onDone}. */

function makeThread(logEl, labels) {
  return function play(steps, opts) {
    opts = opts || {};
    const stepDelay = opts.stepDelay || 450;
    logEl.innerHTML = "";
    let lastSide = null;
    steps.forEach((step, i) => {
      const delay = opts.reduceMotion ? 0 : i * stepDelay;
      setTimeout(() => {
        if (step.side === "system") {
          const note = document.createElement("div");
          note.className = "thread-system" + (step.tone ? " " + step.tone : "");
          note.textContent = step.text;
          logEl.appendChild(note);
          lastSide = null; // the next real message always gets its own label back
        } else {
          if (step.side !== lastSide) {
            const label = document.createElement("div");
            label.className = "thread-role " + step.side;
            label.textContent = labels[step.side];
            logEl.appendChild(label);
          }
          const line = document.createElement("div");
          line.className = "thread-line " + step.side;
          line.textContent = step.text;
          logEl.appendChild(line);
          lastSide = step.side;
        }
        if (i === steps.length - 1 && opts.onDone) opts.onDone();
      }, delay);
    });
  };
}
