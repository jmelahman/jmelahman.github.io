from needle.cases import NeedleTestCase
from needle.driver import NeedleFirefox
from needle.engines.pil_engine import Engine
from selenium.webdriver.firefox.options import Options


class BaseNeedleTest(NeedleTestCase):

    def setUp(self):
        self.engine = Engine()
        options = Options()
        options.set_headless()
        self.driver = NeedleFirefox(firefox_options=options)
        self._base_url = 'https://jmelahman.github.io/index.html'

    def tearDown(self):
        if self.driver:
            self.driver.quit()
