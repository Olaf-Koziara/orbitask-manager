from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # We need a user to be logged in, we set up local storage for authentication.
        page.goto("http://localhost:8080/auth/login")
        page.evaluate('''
            localStorage.setItem('auth-storage', JSON.stringify({
                state: {
                    user: { id: '1', name: 'Test User', email: 'test@example.com' },
                    token: 'fake-jwt-token.part2.part3',
                    isAuthenticated: true
                },
                version: 0
            }));
            localStorage.setItem('token', 'fake-jwt-token.part2.part3');
        ''')

        # Go to tasks to trigger the filters
        page.goto("http://localhost:8080/tasks")
        page.wait_for_timeout(3000)

        # Type in the search
        search_input = page.get_by_label("Search tasks")
        search_input.fill("test task")
        page.wait_for_timeout(1000)

        page.screenshot(path="task-filters-search-clear.png")

        # Click on the clear search button
        page.get_by_role("button", name="Clear search").click()
        page.wait_for_timeout(500)

        # Open filters popover
        page.get_by_role("button", name="Filters").click()
        page.wait_for_timeout(500)

        # Set a filter
        page.get_by_role("combobox").first.click()
        page.wait_for_timeout(500)
        page.keyboard.press("ArrowDown")
        page.keyboard.press("Enter")
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

        page.screenshot(path="task-filters-active-clear.png")

        browser.close()

if __name__ == "__main__":
    run()
