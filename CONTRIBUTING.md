# conventional commits

refer to the
[conventional commits spec](https://www.conventionalcommits.org/en/v1.0.0/#specification)

except for this commit type:  
* **post**
    Pertains to content in `src/content`.
    Scope must be the content title; content title
    scopes are not used anywhere else.  
    e.g. "post(angle-arithmetic-formulas): add half-angle
    function"

### scopes

* **deps**
* **blog** pertains to `src/pages/blog`, or *very
    general* changes to `src/content`
    * e.g. changing every \<img\> tag
* **tags** pertains to `src/pages/tags`
* **home** pertains to the homepage
* **css**
* **dx** pertains to development experience

### footers

* **wip** add `wip: true` at end of a post commit if not
    intended to be a final copy

### deprecations

**2024-05-01** Instead of using "feat(blog): content-title change", use "post(content-title): change"