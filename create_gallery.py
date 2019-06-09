from os import listdir

from os.path import isfile, join
mypath  = "./images/gallery"
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
i = len(onlyfiles)
for file in onlyfiles:
    html =    '        <div id="' + str(i) + '" class="frame">\n' \
            + '          <div class="frame-border">"\n' \
            + '            <img src="/images/gallery/' + file + '" alt="TODO(jamison) Add alt"/>\n' \
            + '            <p class="caption">TODO(jamison) Add caption.</p>\n' \
            + '          </div>\n' \
            + '        </div>'
    i -= 1
    print (html)
