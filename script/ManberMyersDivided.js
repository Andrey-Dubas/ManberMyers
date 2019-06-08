
/**
 * @param {string} [arr]
 * @return Map
 */
export function initialSort(arr)
{
    let dict = new Map();

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

export function getReverse(order)
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

export function getBucketReferences(buckets)
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
}

export function calculateElementsPerBucket(startIndex, endIndex, buckets, order, reverse, n)
{
    let localBucketCounter = new Map();
    for (let j = startIndex; j < endIndex; ++j)
    {
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

    return localBucketCounter;
}

export function calculateBeginIndexOfBucket(localBucketCounter, sortedKeys)
{
    for (let i = sortedKeys.length-1; i >= 1; --i)
    {
        localBucketCounter.set(sortedKeys[i], localBucketCounter.get(sortedKeys[i-1]));
    }
    localBucketCounter.set(sortedKeys[0], 0);

    for (let i = 1; i < sortedKeys.length; ++i)
    {
        localBucketCounter.set(sortedKeys[i],
            localBucketCounter.get(sortedKeys[i]) + localBucketCounter.get(sortedKeys[i-1]));
    }
}

export function updateBucketArray(newBuckets, localBucketCounter, sortedKeysArr, currentBucketStart, currentBucketEnd)
{
    for (let j = 1; j < sortedKeysArr.length; ++j)
    {
        let begin = localBucketCounter.get(sortedKeysArr[j-1]);
        for (let k = begin; k < localBucketCounter.get(sortedKeysArr[j]); ++k)
        {
            newBuckets[k + currentBucketStart] = begin + currentBucketStart;
        }
    }

    let begin = localBucketCounter.get(sortedKeysArr[sortedKeysArr.length-1]) + currentBucketStart;
    for (let k = begin; k < currentBucketEnd; ++k)
    {
        newBuckets[k] = begin;
    }
}

export function updateOrder(newOrder, order, reverse, localBucketCounter, buckets, startBucket, endBucket, prefixSize)
{
    for (let j = startBucket; j < endBucket; ++j)
    {
        let suffixOrderIndex = getSuffixPosition(order, reverse, prefixSize, j);
        let bucketRef = buckets[suffixOrderIndex];
        let newIndex = startBucket + localBucketCounter.get(bucketRef);

        newOrder[newIndex] = order[j];
        localBucketCounter.set(bucketRef, localBucketCounter.get(bucketRef) + 1);
    }
}

function nOrderSort(txt, order, buckets, n)
{
    //----------------------------------------------------
    // n sorting inisialization
    //----------------------------------------------------
    let reverse = getReverse(order);
    let bucketRefs = getBucketReferences(buckets);
    let newBuckets = new Array(buckets.length).fill(0);
    let newOrder = [...order];
    //----------------------------------------------------

    for (let i = 2; i < bucketRefs.length; ++i)
    {
        let startBucket = bucketRefs[i-1];
        let endBucket = bucketRefs[i];

        if (order[startBucket] === txt.length) { continue; }

        //--------------------------------------------------
        // calculate how many elements per bucket
        //--------------------------------------------------
        let localBucketCounter = calculateElementsPerBucket(startBucket, endBucket, buckets, order, reverse, n);
        //----------------------------------------------------
        let keys = localBucketCounter.keys();
        let keysArr = Array.from(keys);
        simpleSort(keysArr);
        //----------------------------------------------------

        //-----------------------------------------------------
        // calculate initial indexes of buckets
        //-----------------------------------------------------
        calculateBeginIndexOfBucket(localBucketCounter, keysArr);

        // ---------------------------------------------------------------------
        // put new values to newBucket
        // ---------------------------------------------------------------------
        updateBucketArray(newBuckets, localBucketCounter, keysArr, startBucket, endBucket);
        // ---------------------------------------------------------------------

        updateOrder(newOrder, order, reverse, localBucketCounter, buckets, startBucket, endBucket, n);
    }

    return [newOrder, newBuckets];
}

function getSortedSuffixIndexes(txt)
{
    let order = initialSort(txt);
    let buckets = getFirstOrderBuckets(txt, order);
    for (let n = 1; n < txt.length*2; n *= 2)
    {
        [order, buckets] = nOrderSort(txt, order, buckets, n);
    }

    return order;
}