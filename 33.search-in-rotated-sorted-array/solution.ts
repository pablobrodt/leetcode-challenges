const INDEX_NOT_FOUND = -1;

function isSorted(nums: number[], startIndex: number, endIndex: number) {
  return nums[startIndex] <= nums[endIndex];
}

function binarySearch(
  nums: number[],
  target: number,
  startIndex: number,
  endIndex: number
): number {
  let end = endIndex;
  let start = startIndex;
  let mid = Math.ceil(end / 2);

  // while we dont reach the last iteration for the binary search
  while (true) {
    // if our target is equal our current mid value then we found the index
    if (target === nums[mid]) {
      return mid;
    }

    if (target < nums[mid]) {
      // if our target is lower than our mid value
      // then we can ensure that our last index is the current mid
      end = mid;

      // we round down our mid so we can consider the index zero
      const possibleMidpoint = Math.floor(end / 2);

      // if our possible new mid is lower or equal our start, we use the start value as mid
      // if not, we can use the new possible mid
      mid = possibleMidpoint <= start ? start : possibleMidpoint;

      // after that we can skip for the next loop iteration
      continue;
    }

    if (target > nums[mid]) {
      // if our target is greater than our mid value
      // we can be sure that what we want is at least after the mid
      // so we can set the start value as the first index after our mid.
      start = mid + 1;

      // then our new mid will be the current mid plus half of himself
      // so we will reach the half between our start and our end
      const possibleMidpoint = mid + Math.ceil(mid / 2);

      // if the new possible mid is greater or equal our final index, we use the final
      // if not, we can use the possible mid
      mid = possibleMidpoint >= end ? end : possibleMidpoint;
    }
  }
}

function recursiveSearch(
  nums: number[],
  target: number,
  startIndex: number,
  endIndex: number
): number {
  const isEmptyArray = nums.length === 0;
  const arrayHasOnlyOneItem = nums.length === 1;

  if (isEmptyArray || (arrayHasOnlyOneItem && target !== nums[startIndex])) {
    return INDEX_NOT_FOUND;
  }

  // sum the negative value of start index an sum the end index
  // resulting in the remaining count of indexes to check
  const remainingIndexes = -startIndex + endIndex;

  // set the midpoint as start index plus half of the remaining ones
  const midpoint = Math.floor(startIndex + remainingIndexes / 2);

  // if the value of the midpoint position is our target, we found it
  if (nums[midpoint] === target) {
    return midpoint;
  }

  // if the first half of the array is sorted, we are going to do some binary search
  if (isSorted(nums, startIndex, midpoint)) {
    // here we make sure that our target is in this half of the array
    // by checking if it is between the first and last values since those values are sorted
    if (target >= nums[startIndex] && target <= nums[midpoint]) {
      // run the binary search in the first half of the array
      // from start index to the midpoint
      return binarySearch(nums, target, startIndex, midpoint);
    }
  }

  // if the first half of the array isn't sorted, we can use the same search logic so far
  // because it's just gonna be a smaller array with the same elements pattern
  if (!isSorted(nums, startIndex, midpoint)) {
    const index = recursiveSearch(nums, target, startIndex, midpoint);

    // if the index returned from our search is greater than -1 (INDEX_NOT_FOUND)
    // then we found the element and we return its index
    if (index > INDEX_NOT_FOUND) {
      return index;
    }
  }

  // if we didn't found the element in the first half of the array
  // we can use the midpoint + 1 as the starting index for the second half
  const rightHalfStartIndex = midpoint + 1;

  // if the second half is sorted
  if (isSorted(nums, rightHalfStartIndex, endIndex)) {
    // and our target is within range
    if (target >= nums[rightHalfStartIndex] && target <= nums[endIndex]) {
      // then we use binary search again
      return binarySearch(nums, target, rightHalfStartIndex, endIndex);
    }
  }

  // if the second half is not sorted
  if (!isSorted(nums, rightHalfStartIndex, endIndex)) {
    // again we search using the same logic
    const index = recursiveSearch(nums, target, rightHalfStartIndex, endIndex);

    // if the found index is greater then -1 (INDEX_NOT_FOUND)
    // then we found the element and we return its index
    if (index > INDEX_NOT_FOUND) {
      return index;
    }
  }

  // if we searched in both halfs and haven't found any index
  // greater then -1 (INDEX_NOT_FOUND), then we dont have the target anywhere
  return INDEX_NOT_FOUND;
}

function search(nums: number[], target: number): number {
  const lastIndex = nums.length - 1;

  // set the starting midpoint
  const midpoint = Math.floor(lastIndex / 2);

  // if the value of the midpoint position is our target, we found it
  if (nums[midpoint] === target) {
    return midpoint;
  }

  // then we use our search logic starting at index 0 until the
  // very last index of the nums array
  return recursiveSearch(nums, target, 0, lastIndex);
}
