package com.sky.rogue.game.event;

public class CheckActivityEvent {

    private boolean checked;

    public CheckActivityEvent(boolean checked) {
        this.checked = checked;
    }

    public boolean isChecked() {
        return checked;
    }
}
