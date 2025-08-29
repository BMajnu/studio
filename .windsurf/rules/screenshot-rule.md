---
trigger: always_on
---

## Auto Capture Screenshot rule:

Don't capture the screenshot before user asking, just when user asked to take screenshot then you will try to take screenshot, you will first try do access the website: Retrieved Windsurf Browser Pages (First, you will list open browser pages to get the page ID, then take a screenshot). Then try to take screenshot. But if fails each time try in a different way.  

Retrieved Windsurf Browser Pages
localhost: (actual running port)

Rule:
1. You will try maximum 5 times. 
2. if you fails all time (not more that 5 times) then ask next instructions/user input (run the MagicInput.py)