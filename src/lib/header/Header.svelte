<script>
	import logo from './logo.svg';
</script>

<header>
	<div class="corner">
		<a href="https://daily.co">
			<img src={logo} alt="Daily" />
		</a>
	</div>

	<div class="corner">
		<!-- TODO put something else here? github link? -->
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	a:hover {
		color: var(--turquoise);
	}
</style>
