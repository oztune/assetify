# assetify

## Usage

### In library project:

```
// package.json
{
  "browserify": {
    "transform": [..., "assetify"]
  }
}
```

### In host project:

```
const assetify = require('assetify/plugin')

browserify('file.js', {
  plugin:[assetify(...)]
})
```
