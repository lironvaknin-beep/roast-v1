<script lang="ts">
	// This is the TypeScript area for our page's logic
	let capturedImageData: string | null = null;
	let roastResult: string = '';
	let isLoading: boolean = false;
	let currentMode: 'camera' | 'upload' = 'upload'; // Start with upload mode as default

	function handleFileSelect(e: Event) {
	const input = e.target as HTMLInputElement;
	const file = input.files?.[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = (event) => {
	capturedImageData = event.target?.result as string;
	};
	reader.readAsDataURL(file);
	}

	async function getRoast() {
	if (!capturedImageData) return;
	isLoading = true;
	roastResult = '';

	try {
	const response = await fetch('/api/roast', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ imageData: capturedImageData })
	});

	if (!response.ok) {
	throw new Error('Network response was not ok');
	}

	const data = await response.json();
	roastResult = data.roastText;
	} catch (error) {
	console.error('Error fetching roast:', error);
	roastResult = 'אופס, משהו השתבש... נסה שוב.';
	} finally {
	isLoading = false;
	}
	}
</script>

<main>
	<h1>Roast.ai</h1>
	<p>העלה תמונה וקבל "צלייה" קומית מבינה מלאכותית</p>

	{#if !capturedImageData}
	<div class="upload-box">
		<label for="file-upload">📂 בחר תמונה...</label>
		<input id="file-upload" type="file" accept="image/*" on:change={"handleFileSelect"} />
	</div>
	{/if}

	{#if capturedImageData}
	<div class="preview">
		<img src={"capturedImageData"} alt="Captured preview" />
		<button class="roast-btn" on:click={"getRoast"} disabled={"isLoading"}>
			{isLoading ? 'חושב...' : 'קבל Roast!'}
		</button>
	</div>
	{/if}

	{#if roastResult}
	<div class="result-box">
		<p>{roastResult}</p>
	</div>
	{/if}
</main>

<style>
	main { max-width: 500px; margin: 2rem auto; text-align: center; font-family: sans-serif; }
	.upload-box { border: 2px dashed #ccc; padding: 40px; margin-top: 20px; border-radius: 10px; }
	.upload-box label { cursor: pointer; background-color: #007bff; color: white; padding: 15px 25px; border-radius: 8px; font-size: 18px; }
	input[type='file'] { display: none; }
	.preview img { max-width: 100%; border-radius: 10px; margin-top: 20px; }
	.roast-btn { width: 100%; padding: 15px; font-size: 18px; margin-top: 15px; background-color: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; }
	.result-box { margin-top: 20px; padding: 20px; background-color: #f0f8ff; border: 2px solid #bde0fe; border-radius: 10px; font-size: 20px; }
</style>