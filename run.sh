#!/bin/bash

SESSION="game-stop"

# Start a new tmux session named "game-stop" with the first window "full"
tmux new-session -d -s $SESSION -n full

# Create "frontend" window and run frontend commands
tmux new-window -t $SESSION:1 -n frontend
tmux send-keys -t $SESSION:frontend 'cd frontend-services && npm run dev' C-m

# Create "backend" window and run backend commands
tmux new-window -t $SESSION:2 -n backend
tmux send-keys -t $SESSION:backend 'conda activate gamestop' C-m
tmux send-keys -t $SESSION:backend 'source venv/bin/activate' C-m
tmux send-keys -t $SESSION:backend 'cd backend-services && python manage.py runserver' C-m

# Attach to the session
tmux attach -t $SESSION
