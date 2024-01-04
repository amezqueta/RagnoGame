<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import io from 'socket.io-client'
    import { onMount } from 'svelte';

  let socket = io('http://localhost:3000'); // Conectar al servidor desde el cliente
  
	onMount(() => {
	  socket.on('connect', () => {
		console.log('Conectado al servidor');
	  });
	});
</script>

<Canvas>
  <Scene {socket} />
</Canvas>