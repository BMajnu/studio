import os

def main():
    """Main function to run the interactive task loop."""
    while True:
        print("\nWhat would you like to do?")
        print("1. New Task")
        print("2. Follow Up")
        
        choice = input("Enter your choice (1 or 2, or 'stop' to exit): ")

        if choice == '1':
            handle_new_task()
        elif choice == '2':
            handle_follow_up()
        elif choice.lower() == 'stop':
            print("Exiting MagicTask. Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 'stop'.")

def handle_new_task():
    """Handles the new task workflow."""
    task_type = input("Is this a SIMPLE or COMPLEX task? ").lower()
    if task_type not in ['simple', 'complex']:
        print("Invalid task type. Please enter 'simple' or 'complex'.")
        return

    prompt = input("Please describe the task: ")
    
    if task_type == 'simple':
        print("\nReceived new SIMPLE task.")
        print(f"Task: {prompt}")
        print("Analyzing requirements and creating an implementation plan...")
        # In a real scenario, this would trigger analysis and implementation.
        # For now, we just acknowledge.
        print("Implementation would start now.")

    elif task_type == 'complex':
        print("\nReceived new COMPLEX task.")
        print(f"Task: {prompt}")
        print("Analyzing requirements and devising a multi-phase plan...")
        
        plan = "## Phase 1 - YYYY-MM-DD\n- [ ] Step 1\n- [ ] Step 2" # Dummy plan
        
        if not os.path.exists("MTask.md"):
            print("Creating MTask.md...")
        
        with open("MTask.md", "a") as f:
            f.write(f"\n\nTask: {prompt}\n{plan}\n")
            
        print("Plan recorded in MTask.md. Please review and approve.")
        print("Waiting for user approval before starting Phase 1.")

def handle_follow_up():
    """Handles the follow-up workflow."""
    if not os.path.exists("MTask.md"):
        print("\nNo MTask.md found. It seems there are no complex tasks to follow up on.")
        print("For simple tasks, the implementation would have already started.")
        return
        
    print("\nFollowing up on the plan in MTask.md...")
    # This is a simplified simulation of checking off tasks.
    # A real implementation would parse the markdown and update it.
    print("Executing next phase/step from the plan...")
    print("Checking off completed items in MTask.md...")

if __name__ == "__main__":
    main() 