# Get Version Tag

[![Continuous Integration](https://github.com/efirestone/get-version-tag-action/actions/workflows/ci.yml/badge.svg)](https://github.com/efirestone/get-version-tag-action/actions/workflows/ci.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/efirestone/get-version-tag-action?logo=github&sort=semver)](https://github.com/efirestone/get-version-tag-action/releases)


GitHub Action that gets the version from a tag on the current SHA

## Input

The action requires no input parameters. The action will fail if no appropriate git tag can be found.

## Output

This action has two outputs:

- `version` - The version from the tag, numbers only, like `1.2.3`
- `version-with-v` - The version from the tag, prefixed with "v", like `v1.2.3`

## Example

Find more examples in the [examples directory](./examples/).

```yaml
name: Generate
jobs:
  generate:
    steps:
      - uses: actions/checkout@v2.2.0
        with:
          fetch-depth: 0 # Required due to the way Git works, without it this action won't be able to find any or the correct tags

      # This action will fail if no version tag is found.
      - name: 'Get version from tag'
        id: versiontag
        uses: "efirestone/get-version-tag-action@v1"

      - run: echo "Found version: ${{ steps.versiontag.outputs.version-with-v }}"
```

## Recognition ##

The [get-previous-tag](https://github.com/WyriHaximus/github-action-get-previous-tag)
action by [Cees-Jan Kiewiet](http://wyrihaximus.net/) was used as the initial template
for the structure of this project. Big thanks to him for the jumping off point.

## License ##

Copyright 2021 [Eric Firestone](https://twitter.com/firetweet)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
