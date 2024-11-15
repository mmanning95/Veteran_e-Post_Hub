from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Connect to the Selenium Grid that will be running in your Docker container
driver = webdriver.Remote(
    command_executor='http://localhost:4444/wd/hub',  # Connect to Selenium Grid
    desired_capabilities=DesiredCapabilities.EDGE  # Use Edge as the browser
)

try:
    # Step 1: Open the login page and wait for it to load
    driver.get("http://host.docker.internal:3000/Login")  # Adjust URL if needed
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email")))

    # Step 2: Enter login credentials
    email_input = driver.find_element(By.NAME, "email")
    email_input.send_keys("john@test.com")
    
    password_input = driver.find_element(By.NAME, "password")
    password_input.send_keys("password")

    # Step 3: Click the login button
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")
    login_button.click()

    # Step 4: Wait for redirect after login
    WebDriverWait(driver, 10).until(EC.url_contains("/Member"))

    # Step 5: Verify login is successful by checking the URL
    current_url = driver.current_url
    assert "/Member" in current_url, "Test Failed: User was not redirected to /Member after login."
    print("Login successful. Proceeding with logout test.")

    # Step 6: Locate and click the logout button within the navbar
    try:
        # Longer timeout to ensure the navbar is fully rendered
        logout_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Logout']"))
        )
        logout_button.click()
    except (TimeoutException, NoSuchElementException):
        print("Test Failed: Logout button not found.")

    # Step 7: Wait for the logout to complete
    WebDriverWait(driver, 10).until(EC.url_contains("/Login"))

    # Step 8: Verify logout by checking if redirected to the login page
    current_url = driver.current_url
    assert "/Login" in current_url, "Test Failed: User was not redirected to login page after logout."
    print("Test Passed: User successfully logged out and redirected to login page.")

finally:
    # Step 9: Close the browser
    driver.quit()









# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.edge.service import Service
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException, NoSuchElementException
# from webdriver_manager.microsoft import EdgeChromiumDriverManager

# # Set up the WebDriver for Microsoft Edge
# driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))

# try:
#     # Step 1: Open the login page and wait for it to load
#     driver.get("http://localhost:3000/Login")  # Adjust URL if needed
#     WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email")))

#     # Step 2: Enter login credentials
#     email_input = driver.find_element(By.NAME, "email")
#     email_input.send_keys("john@test.com")
    
#     password_input = driver.find_element(By.NAME, "password")
#     password_input.send_keys("password")

#     # Step 3: Click the login button
#     login_button = driver.find_element(By.XPATH, "//button[text()='Login']")
#     login_button.click()

#     # Step 4: Wait for redirect after login
#     WebDriverWait(driver, 10).until(EC.url_contains("/Member"))

#     # Step 5: Verify login is successful by checking the URL
#     current_url = driver.current_url
#     assert "/Member" in current_url, "Test Failed: User was not redirected to /Member after login."
#     print("Login successful. Proceeding with logout test.")

#     # Step 6: Locate and click the logout button within the navbar
#     try:
#         # Longer timeout to ensure the navbar is fully rendered
#         logout_button = WebDriverWait(driver, 15).until(
#             EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Logout']"))
#         )
#         logout_button.click()
#     except (TimeoutException, NoSuchElementException):
#         print("Test Failed: Logout button not found.")

#     # Step 7: Wait for the logout to complete
#     WebDriverWait(driver, 10).until(EC.url_contains("/Login"))

#     # Step 8: Verify logout by checking if redirected to the login page
#     current_url = driver.current_url
#     assert "/Login" in current_url, "Test Failed: User was not redirected to login page after logout."
#     print("Test Passed: User successfully logged out and redirected to login page.")

# finally:
#     # Step 9: Close the browser
#     driver.quit()
