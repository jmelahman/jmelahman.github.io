import nose

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from base_needle_test import BaseNeedleTest
from utils import wait_and_find_element

class TestIndex(BaseNeedleTest):
    @classmethod
    def setUpClass(cls):
        super(BaseNeedleTest, cls).setUp(cls)

    def test_style(self):
        self.driver.get(self._base_url)
        self.assertScreenshot("#nav", "nav")

    # TODO: Finish test.
    # def test_navigation(self):
    #     self.driver.get(self._base_url)
    #     elements = self.driver.find_elements(By.TAG_NAME, 'a')
    #     for index in range(len(elements)):
    #         elements = self.driver.find_elements(By.TAG_NAME, 'a')
    #         elements[index].send_keys(Keys.ENTER)
    #         wait_and_find_element(self.driver, By.TAG_NAME, 'header')
    #         self.assertTrue(elements[index].text in self.driver.current_url)
    #         self.driver.get(self._base_url)

    @classmethod
    def tearDownClass(cls):
        cls.tearDown(cls)

if __name__ == '__main__':
    nose.main()
