import { ref, computed, type Ref, unref } from 'vue';
import { PAGINATION_OPTIONS } from '@/constants';

export function usePagination(totalCount: Ref) {
	const selectedLimit = ref(25);
	const currPage = ref(1);
	// const subjectsStore = useSubjectsStore();
	const options = PAGINATION_OPTIONS;

	const currTotal = computed(() => {
		// current total count for the currently fetched on pagination display
		return currPage.value * selectedLimit.value;
	});

	const currStart = computed(() => {
		// current start count for the currently fetched on pagination display
		return currTotal.value ? currTotal.value - selectedLimit.value + 1 : 0;
	});

	const prevIsDisabled = computed(() => {
		return currPage.value === 1;
	});

	const nextIsDisabled = computed(() => {
		return currPage.value * selectedLimit.value >= unref(totalCount);
	});

	function goPrev() {
		if (!prevIsDisabled.value) {
			currPage.value--;
		}
	}

	function goNext() {
		// don't allow if it exceeds total count
		if (!nextIsDisabled.value) {
			currPage.value++;
		}
	}

	return {
		options,
		selectedLimit,
		currPage,
		currTotal,
		currStart,
		prevIsDisabled,
		nextIsDisabled,
		goPrev,
		goNext,
	};
}
