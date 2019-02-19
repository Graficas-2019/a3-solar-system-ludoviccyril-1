function setup(canvas) {
  // setup renderer
  let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.width, canvas.height);

  // set up camera
  let camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000
  );
  camera.position.set(-2, 6, 12);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // set up scene
  let scene = new THREE.Scene();
  scene.add(camera);

  let group = new THREE.Object3D();

  ambientLight = new THREE.AmbientLight(0x888888);
  group.add(ambientLight);

  geometry = new THREE.CubeGeometry(2, 2, 2);

  // And put the geometry and material together into a mesh
  mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  mesh.position.y = 3;

  // Add the mesh to our group
  group.add(mesh);

  let loader = new THREE.OBJLoader();
  loader.load('http://misc.tenatek.com/asteroid.obj', object => {
    object.position.set(0, 0, 0);
    group.add(object);
  });

  scene.add(group);

  return { renderer, scene, camera, controls };
}

function run(elements) {
  requestAnimationFrame(function() {
    run(elements);
  });

  elements.renderer.render(elements.scene, elements.camera);
  elements.controls.update();
}

$(document).ready(() => {
  let canvas = document.getElementById('solar');
  let elements = setup(canvas);
  run(elements);
});
