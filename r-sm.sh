# Replace with your submodule path
SUBMODULE_PATH=frontend2

git config -f .gitmodules --remove-section submodule.$SUBMODULE_PATH
git config -f .git/config --remove-section submodule.$SUBMODULE_PATH
git rm --cached $SUBMODULE_PATH
rm -rf $SUBMODULE_PATH
rm -rf .git/modules/$SUBMODULE_PATH
git commit -m "Remove submodule $SUBMODULE_PATH"
