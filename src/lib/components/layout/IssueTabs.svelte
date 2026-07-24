<script>
    import { appState } from '$lib/state.svelte.js';

    let { tabs = [] } = $props();
</script>

{#if appState.mainView === 'issues'}

				<header class="header">

					{#each tabs as tab}

						<button
							class="tab {tab}"
							class:active={appState.subTab === tab}
							onclick={() => (appState.subTab = tab)}
						>
							{tab}
						</button>

					{/each}

				</header>

			{/if}