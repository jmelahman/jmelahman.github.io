from needle.cases import NeedleTestCase
from needle.driver import NeedleFirefox
from needle.engines.pil_engine import Engine

class BaseNeedleTest(NeedleTestCase):

    def setUp(self):
        self.engine = Engine()
        self.driver = NeedleFirefox()
        self._base_url = "https://jmelahman.github.io/index.html"


    def tearDown(self):
        if self.driver:
            self.driver.quit()

