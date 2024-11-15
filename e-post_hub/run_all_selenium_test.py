import os
import subprocess

# Directory containing Selenium test scripts
test_directory = "__Stest__"

# Iterate over all files in the test directory
for file in os.listdir(test_directory):
    if file.startswith("test_selenium_") and file.endswith(".py"):
        # Construct the full path to the test script
        script_path = os.path.join(test_directory, file)
        # Execute the script using Python
        result = subprocess.run(["python3", script_path], capture_output=True, text=True)
        # Print the output of each test script
        print(f"Running test: {file}")
        print(result.stdout)
        if result.returncode != 0:
            print(f"Test {file} failed with the following error:\n{result.stderr}")
        else:
            print(f"Test {file} passed successfully.\n")

