# Website

Personal website

## Tooling

### Installation

Install pip,

```shell
sudo pacman -S python-pip
```

Install testing software,

```shell
pip install --user selenium
pip install --user needle
pip install --user nose
```

Ensure that the testing software is somewhere in `PATH`,

```shell
echo 'PATH="$PATH:$HOME/.local/bin"' >> /etc/environment
```

Download the necessary driver from (https://github.com/mozilla/geckodriver/releases)[here].

Unzip and move to a proper directory,

```shell
cd ~/Downloads
tar -zxvf geckodriver-*.tar.gz
mv geckodriver $HOME/.local/bin
```

### Running Tests

Running the tests for the first time,

```
nosetests test_index.py --with-save-baseline
```

Subsequent runs,

```
nosetests test_index.py
```


### Troubleshooting

```
zsh: command not found: nosetests
```

Install `needle` and `nose`. Make sure it was installed somewhere in `PATH`.

```
selenium.common.exceptions.WebDriverException: Message: 'geckodriver' executable needs to be in PATH.
```

OR

```
FileNotFoundError: [Errno 2] No such file or directory: 'geckodriver': 'geckodriver'
```

Download the necessary driver and move to somewhere in `PATH`.
