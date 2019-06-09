import os

path  = "/home/lahmanja/git/jmelahman.github.io/images/gallery"
os.chdir(path)
files = filter(os.path.isfile, os.listdir(path))
files = [os.path.join(path, f) for f in files]
i= len(files)
for file in files:
    html =    '        <div id="' + str(i) + '" class="frame">\n' \
            + '          <div class="frame-border">\n' \
            + '            <img src="/images/gallery/' + file + '" alt="TODO(jamison) Add alt"/>\n' \
            + '            <p class="caption">TODO(jamison) Add caption.</p>\n' \
            + '          </div>\n' \
            + '        </div>'
    i -= 1
    print (html)
