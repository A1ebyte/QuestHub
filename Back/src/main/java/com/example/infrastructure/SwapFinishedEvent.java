package com.example.infrastructure;

public class SwapFinishedEvent {
    private final Object source;

    public SwapFinishedEvent(Object source) {
        this.source = source;
    }

    public Object getSource() {
        return source;
    }
}
