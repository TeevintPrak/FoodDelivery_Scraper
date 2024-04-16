from selenium import webdriver

driver = webdriver.Chrome()
driver.get('http://www.google.com')
print(driver.title)
driver.quit()
