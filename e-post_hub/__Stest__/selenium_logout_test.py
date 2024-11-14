from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.microsoft import EdgeChromiumDriverManager
import time

# Set up the WebDriver for Microsoft Edge
driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))

try:
    # Step 1: Open the login page and log in first
    driver.get("http://localhost:3000/Login")  # Adjust URL if needed
    time.sleep(2)  # Wait for page to load

    # Step 2: Enter login credentials
    email_input = driver.find_element(By.NAME, "email")  # Adjust field name if needed
    email_input.send_keys("john@test.com")
    
    password_input = driver.find_element(By.NAME, "password")  # Adjust field name if needed
    password_input.send_keys("password")

    # Step 3: Click the login button
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")  # Adjust button locator if needed
    login_button.click()

    # Step 4: Wait for redirect after login
    time.sleep(3)  # Wait for the login action to complete

    # Step 5: Verify login is successful by checking the URL
    current_url = driver.current_url
    if "/Member" not in current_url:
        print("Test Failed: User was not redirected to /Member after login.")
    else:
        print("Login successful. Proceeding with logout test.")

    # Step 6: Locate and click the logout button
    # Assuming the logout button is on the `/Member` page
    logout_button = driver.find_element(By.XPATH, "//button[text()='Logout']")  # Adjust locator for the logout button/link
    logout_button.click()

    # Step 7: Wait for the logout to complete
    time.sleep(3)

    # Step 8: Verify logout by checking if redirected to the login page
    current_url = driver.current_url
    if "/Login" in current_url or "login" in current_url:  # Adjust if different login page URL
        print("Test Passed: User successfully logged out and redirected to login page.")
    else:
        print("Test Failed: User was not redirected to login page after logout.")

finally:
    # Step 9: Close the browser
    driver.quit()
