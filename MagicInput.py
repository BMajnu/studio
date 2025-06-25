# MagicInput.py
# Simple input utility for the interactive task loop

def get_user_input():
    try:
        user_input = input("prompt: ")
        return user_input.strip()
    except (KeyboardInterrupt, EOFError):
        return "stop"

def main():
    while True:
        user_input = get_user_input()
        
        if user_input.lower() == "stop":
            print("Exiting the process.")
            break

if __name__ == "__main__":
    main()