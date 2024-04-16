from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def scrape_links(links):
    options = Options()
    options.add_argument('--headless') 
    driver = webdriver.Chrome(options=options)
    
    results = []
    for link in links:
        print(link)
        driver.get(link)
        # Find elements by the data-testid attribute
        elements = driver.find_elements(By.TAG_NAME, 'h1')
        print(elements)
        # Process each found element
        for element in elements:
            # You can get the inner HTML or text content as needed
            store_title = element.get_attribute('innerHTML').strip()  # or use .text to get the text content
            print(store_title)
            results.append(store_title)
    driver.quit()
    print(results)
    return results
