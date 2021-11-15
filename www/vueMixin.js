Vue.mixin({
	created() {
		const recomputed = Object.create(null)
		const watchers = this._computedWatchers // Warning: Vue internal

		if (!watchers) return

		for (const key in watchers)
			makeRecomputable(watchers[key], key, recomputed)
		
		this.$recompute = (key) => recomputed[key] = !recomputed[key]
		Vue.observable(recomputed)
	}
})
function makeRecomputable(watcher, key, recomputed) {
	const original = watcher.getter
	recomputed[key] = true
	watcher.getter = (vm) => (recomputed[key], original.call(vm, vm))
}