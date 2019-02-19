async function setup(canvas) {
  // setup renderer
  let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.width, canvas.height);

  // set up camera
  let camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000
  );
  camera.position.set(-2, 6, 12);

  // set up orbit controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // set up scene
  let scene = new THREE.Scene();
  scene.add(camera);

  // set up object groups
  let sunGroup = await createSun();
  scene.add(sunGroup);

  let mercuryGroup = await createBody('mercury', 0.5, {
    distance: 10,
    speed: 0.9,
    spinSpeed: 0.2
  });
  scene.add(mercuryGroup);

  let venusGroup = await createBody('venus', 0.8, {
    distance: 20,
    speed: 2,
    spinSpeed: 0.3
  });
  scene.add(venusGroup);

  let earthGroup = await createBody(
    'earth',
    1.2,
    {
      distance: 30,
      speed: 1,
      spinSpeed: 1.2
    },
    [
      [
        'moon',
        0.5,
        {
          distance: 5,
          speed: 2,
          spinSpeed: 0.2
        }
      ]
    ]
  );
  scene.add(earthGroup);

  let marsGroup = await createBody('mars', 0.9, {
    distance: 40,
    speed: 1.1,
    spinSpeed: 0.5
  });
  scene.add(marsGroup);

  let jupiterGroup = await createBody('jupiter', 3, {
    distance: 55,
    speed: 3,
    spinSpeed: 0.7
  });
  scene.add(jupiterGroup);

  let saturnGroup = await createBody('saturn', 2.5, {
    distance: 70,
    speed: 0.9,
    spinSpeed: 1.4
  });
  scene.add(saturnGroup);

  let uranusGroup = await createBody('uranus', 2, {
    distance: 80,
    speed: 0.4,
    spinSpeed: 1.5
  });
  scene.add(uranusGroup);

  let neptuneGroup = await createBody('neptune', 2, {
    distance: 90,
    speed: 2.6,
    spinSpeed: 0.1
  });
  scene.add(neptuneGroup);

  let plutoGroup = await createBody('pluto', 0.5, {
    distance: 100,
    speed: 2.1,
    spinSpeed: 0.3
  });
  scene.add(plutoGroup);

  return { renderer, scene, camera, controls };
}

function run(elements, time) {
  let now = Date.now();
  let delta = now - time;
  time = now;

  requestAnimationFrame(function() {
    run(elements, time);
  });

  elements.scene.traverse(object => {
    if (object.type === 'Object3D' || object.type === 'Mesh') {
      object.update(delta);
    }
  });

  elements.renderer.render(elements.scene, elements.camera);
  elements.controls.update();
}

$(document).ready(async () => {
  let canvas = document.getElementById('solar');
  let elements = await setup(canvas);
  let time = Date.now();
  run(elements, time);
});
