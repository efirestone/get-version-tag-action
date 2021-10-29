const { exec } = require('child_process');

function semVerSort(val1, val2) {
    function arrayValueSort(arrayVal1, arrayVal2) {
        if (arrayVal1.length == 0 && arrayVal2.length == 0) {
            return 0
        }
        const component1 = arrayVal1[0] || 0
        const component2 = arrayVal2[0] || 0

        if (component1 < component2) {
            return -1
        } else if (component1 > component2) {
            return 1
        } else {
            arrayVal1.shift()
            arrayVal2.shift()
            return arrayValueSort(arrayVal1, arrayVal2)
        }
    }

    return arrayValueSort(val1.split('.'), val2.split('.'))
}

exec('git tag --points-at HEAD', (err, rev, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);
        process.exit(1);
    }

    versionTags = rev.trim()
        .split("\n")
        // Check for things that look like versions
        .filter(function(val) {
            return /v?[0-9.]+/.test(val);
          }
        )
        // Remove leading "v"s
        .map(function(val) {
            return val.replace(/^v/, '');
          }
        )
        .sort(semVerSort);

    if (versionTags.length == 0) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any version tags');
        console.log("Ensure the tag was created, and that your GitHub checkout action includes the \"fetch-depth: 0\" parameter.");
        process.exit(1);
    }
    
    const version = versionTags[versionTags.length-1]
    if (versionTags.length > 1) {
        console.log('\x1b[33m%s\x1b[0m', `Multiple tags found (${versionTags.join(", ")}). Using latest: ${version}`);
    } else {
        console.log('Found version \x1b[34m%s\x1b[0m', version);
    }

    console.log(`::set-output name=version::${version}`);
    console.log(`::set-output name=version-with-v::v${version}`);
    process.exit(0);
});
