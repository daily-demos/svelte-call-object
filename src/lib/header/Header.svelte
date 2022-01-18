<script>
	import logo from './assets/logo.svg';
	import svelteLogo from './assets/svelte-logo.svg';
	import githubLogo from './assets/github.svg';
	import newTab from './assets/newtab.svg';
</script>

<header>
	<div class="wrapper">
		<div class="corner left">
			<a href="https://daily.co" target="_blank" rel="noreferrer noopenner">
				<img src={logo} alt="Daily" />
			</a>
			<img src={svelteLogo} alt="Svelte logo" />
			<span>Call object Svelte demo</span>
		</div>

		<div class="corner right">
			<a
				href="https://docs.daily.co/reference/daily-js"
				class="buttonish"
				target="_blank"
				rel="noreferrer noopenner"
			>
				<span>API docs</span>
				<img src={newTab} class="small" alt="Daily docs" />
			</a>
			<a
				href="https://github.com/daily-demos/svelte-call-object"
				target="_blank"
				class="plain-link"
				rel="noreferrer noopenner"
			>
				<img src={githubLogo} alt="Daily demos Github" />
			</a>
		</div>
	</div>
</header>

<style>
	header {
		width: 100vw;
		background-color: var(--white);
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--grey);
	}
	.wrapper {
		max-width: 1024px;
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
	}
	.corner {
		display: flex;
		align-items: center;
	}
	.corner a {
		display: flex;
		align-items: center;
	}
	.corner.left a {
		margin-right: 1rem;
		margin-left: 1rem;
		padding-right: 1rem;
		border-right: 1px solid var(--grey);
	}
	.corner a.buttonish {
		border: 1px solid var(--grey);
		border-radius: 8px;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
	.corner span {
		font-size: 12px;
		line-height: 16px;
		font-weight: 700;
		margin-left: 0.5rem;
	}
	.corner img {
		height: 24px;
	}
	.corner img.small {
		height: 16px;
	}
	.corner.right .plain-link img {
		margin-left: 1rem;
		margin-right: 1rem;
		padding-left: 1rem;
		border-left: 1px solid var(--grey);
	}
	a:hover {
		color: var(--turquoise);
	}
	@media screen and (max-width: 500px) {
		.corner.left span {
			display: none;
		}
	}
</style>
