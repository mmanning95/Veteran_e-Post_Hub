from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.microsoft import EdgeChromiumDriverManager
import time

# Set up the WebDriver for Microsoft Edge
driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))

try:
    # Step 1: Open the login page
    driver.get("http://localhost:3000/Login")  # Adjust URL if needed
    time.sleep(2)  # Wait for page to load

    # Step 2: Locate the email input and enter email
    email_input = driver.find_element(By.NAME, "email")  # Change "email" if your field name is different
    email_input.send_keys("john@test.com")

    # Step 3: Locate the password input and enter password
    password_input = driver.find_element(By.NAME, "password")  # Change "password" if your field name is different
    password_input.send_keys("password")

    # Step 4: Find the login button and click it
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")  # Adjust if button locator is different
    login_button.click()

    # Step 5: Wait for login process and verify success
    time.sleep(3)  # Give some time for the login action to complete

 # Verifying by URL
    current_url = driver.current_url
    if "/Member" in current_url:  # Adjust for a known logged-in URL or page identifier
        print("Test Passed: User successfully redirected to /Member.")
    else:
        print("Test Failed: User was not redirected to /Member.")


finally:
    # Step 6: Close the browser
    driver.quit()
