from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def scrape_links(links):
    options = Options()
    options.add_argument('--headless') 
    driver = webdriver.Chrome(options=options)
    
    results = []
    for link in links:
        driver.get(link)
        html_content = driver.page_source  
        print('page')
        results.append(html_content) 
    
    driver.quit()
    return results
