"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = void 0;
class SessionStore {
}
exports.SessionStore = SessionStore;
class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }
    findSession(id) {
        return this.sessions.get(id);
    }
    saveSession(id, session) {
        this.sessions.set(id, session);
    }
    findAllSessions() {
        return [...this.sessions.values()];
    }
    disconnectUser(id) {
        const found = this.sessions.get(id);
        if (found) {
            this.sessions.set(id, Object.assign(Object.assign({}, found), { connected: false }));
        }
    }
    deleteSession(id) {
        this.sessions.delete(id);
    }
}
exports.default = InMemorySessionStore;
