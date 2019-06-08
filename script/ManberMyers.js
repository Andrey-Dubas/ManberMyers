

function initialSort(arr)
{
    let dict = new Map();// new Array(256).fill(0);

    for (let ch of arr)
    {
        let code = ch.charCodeAt(0);
        if (dict.has(ch))
        {
            dict.set(ch, dict.get(ch) + 1);
        }
        else
        {
            dict.set(ch, 1);
        }
        
    }
    dict.set("", 1);

    let keys = dict.keys();
    let keyArr = Array.from(keys);
    simpleSort(keyArr);

    for (let i = keyArr.length-2; i >= 0; --i)
    {
        let currKey = keyArr[i];
        let nextKey = keyArr[i+1];
        dict.set(nextKey, dict.get(currKey));
    }
    dict.set(keyArr[0], 0);

    for (let i = 0; i < keyArr.length-1; ++i)
    {
        let currKey = keyArr[i];
        let nextKey = keyArr[i+1];
        // dict[i+1] += dict[i];
        dict.set(nextKey, dict.get(nextKey) + dict.get(currKey));
    }

    let res = new Array(arr.length + 1);

    for (const [i, ch] of arr.split("").entries())
    {
        let code = ch.charCodeAt(0);
        res[dict.get(ch)] = i;
        dict.set(ch, dict.get(ch)+1);
    }
    res[0] = arr.length;


    return res;
}

function getReverse(order)
{
    let result = new Array(order.length);

    for (let i of order)
    {
        result[order[i]] = i;
    }

    return result;
}

function printOrderedSuffixes(txt, indexes, buckets)
{
    if (buckets !== undefined)
    {
        for (let i = 0; i < indexes.length; ++i)
        {
            console.log('"' + txt.substring(indexes[i]) + '" ', buckets[i]);
        }
    }
    else
    {
        for (let i = 0; i < indexes.length; ++i)
        {
            console.log('"' + txt.substring(indexes[i]) + '"');
        }
    }
}

function getFirstOrderBuckets(txt, ordered)
{
    let ch = '';
    let currentIndex = 0;
    let buckets = new Array(ordered.length);
    for (let [index, orderIndex] of ordered.entries())
    {
        if (ch != txt[orderIndex])
        {
            currentIndex = index;
            ch = txt[orderIndex];
        }
        buckets[index] = currentIndex;
    }

    return buckets;
}

function getSuffixPosition(oldOrder, reverse, n, index)
{
    let origTextIndex = oldOrder[index];
    let shifted = origTextIndex + n;
    return reverse[shifted];
}

function getBucketReferences(buckets)
{
    let bucketRefs = [];

    let last = buckets[0];
    bucketRefs.push(0);

    for (let i = 1; i < buckets.length; ++i)
    {
        if (last !== buckets[i])
        {
            last = buckets[i];
            bucketRefs.push(i);
        }
    }

    return bucketRefs;
}

function simpleSort(arr)
{
    for (let i = 1; i < arr.length; ++i)
    {
        for (let j = i; j >= 0; --j)
        {
            if (arr[j] < arr[j-1])
            {
                [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
            }
        }
    }

    let y = 0;
}

function nOrderSort(txt, order, buckets, n)
{
    let reverse = getReverse(order);
    let bucketRefs = getBucketReferences(buckets);
    let newBucketRefs = [];
    let newBuckets = new Array(buckets.length).fill(0);
    let newOrder = [...order];

    for (let i = 2; i < bucketRefs.length; ++i)
    {
        // console.log("______");
        // printOrderedSuffixes(txt, newOrder, buckets);
        let startBucket = bucketRefs[i-1];
        let endBucket = bucketRefs[i];

        if (order[startBucket] === txt.length) { continue; }

        let localBucketCounter = new Map(); //new Array(buckets.length).fill(0);
        for (let j = startBucket; j < endBucket; ++j)
        {
            if (n === 2)
            {
                let t= 9;
                if (j === txt.length-2)
                {
                    let r = 2;
                }
            }
            let suffix = txt.substring(order[j]);
            let suffixOrderIndex = getSuffixPosition(order, reverse, n, j);
            if (localBucketCounter.has(buckets[suffixOrderIndex]))
            {
                localBucketCounter.set(buckets[suffixOrderIndex], localBucketCounter.get(buckets[suffixOrderIndex])+1);
            }
            else
            {
                localBucketCounter.set(buckets[suffixOrderIndex], 1);
            }
        }


        let keys = localBucketCounter.keys();
        let keysArr = Array.from(keys);
        simpleSort(keysArr);

        for (let i = keysArr.length-1; i >= 1; --i)
        {
            localBucketCounter.set(keysArr[i], localBucketCounter.get(keysArr[i-1]));
        }
        localBucketCounter.set(keysArr[0], 0);

        for (let i = 1; i < keysArr.length; ++i)
        {
            localBucketCounter.set(keysArr[i],
                localBucketCounter.get(keysArr[i]) + localBucketCounter.get(keysArr[i-1]));
        }

        for (let j = 0; j < keysArr.length; ++j)
        {
            newBucketRefs.push(startBucket + localBucketCounter.get(keysArr[j]));
        }


        // ---------------------------------------------------------------------
        // put new values to newBucket;
        // ---------------------------------------------------------------------
        for (let j = 1; j < keysArr.length; ++j)
        {
            let begin = localBucketCounter.get(keysArr[j-1]);
            for (let k = begin; k < localBucketCounter.get(keysArr[j]); ++k)
            {
                newBuckets[k + startBucket] = begin + startBucket;
            }
        }

        let begin = localBucketCounter.get(keysArr[keysArr.length-1]) + startBucket;
        for (let k = begin; k < endBucket; ++k)
        {
            newBuckets[k] = begin;
        }
        // ---------------------------------------------------------------------

        for (let j = startBucket; j < endBucket; ++j)
        {
            let suffixOrderIndex = getSuffixPosition(order, reverse, n, j);
            let bucketRef = buckets[suffixOrderIndex];
            let newIndex = startBucket + localBucketCounter.get(bucketRef);
            let t = txt.substring(order[j]);

            newOrder[newIndex] = order[j];
            localBucketCounter.set(bucketRef, localBucketCounter.get(bucketRef) + 1);
        }
    }

    return [newOrder, newBuckets];
}

function getSortedSuffixIndexes(txt)
{
    let order = initialSort(txt);
    let buckets = getFirstOrderBuckets(txt, order);
    printOrderedSuffixes(txt, order);
    for (let n = 1; n < txt.length*2; n *= 2)
    {
        [order, buckets] = nOrderSort(txt, order, buckets, n);
    }

    return order;
}

// let txt = "abracadabra is from harry potter, you dirty piece of something that reminds a magic avid goblin in alamaba, yes, sweet something in balabanov movie";
let txt = 'abracadabra';

let order = getSortedSuffixIndexes(txt);
printOrderedSuffixes(txt, order);