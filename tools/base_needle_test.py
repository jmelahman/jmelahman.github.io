from needle.cases import NeedleTestCase
from needle.driver import NeedleFirefox

def import_from_string(path):
    """
    Utility function to dynamically load a class specified by a string,
    e.g. 'path.to.my.Class'.
    """
    module_name, klass = path.rsplit('.', 1)
    module = __import__(module_name, fromlist=[klass])
    return getattr(module, klass)

class BaseNeedleTest(NeedleTestCase):

    def setUp(self):
        klass = import_from_string('needle.engines.pil_engine.Engine')
        self.engine = klass()
        self.driver = NeedleFirefox()
        self._base_url = "https://jmelahman.github.io/index.html"


    def tearDown(self):
        if self.driver:
            self.driver.quit()

