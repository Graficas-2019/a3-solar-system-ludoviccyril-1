async function createSun() {
  let group = new THREE.Object3D();

  let maps = {};
  await new Promise(resolve => {
    new THREE.TextureLoader().load(
      'assets/sun_texture.jpg',
      textureMap => {
        maps.map = textureMap;
        resolve();
      },
      null,
      resolve
    );
  });

  let object = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 64),
    new THREE.MeshBasicMaterial(maps)
  );
  group.add(object);

  let light = new THREE.PointLight(0xffffff, 1, 0, 2);
  group.add(light);

  group.update = () => {};

  return group;
}

async function createBody(name, size, orbit, moons, rings) {
  let group = new THREE.Object3D();

  let maps = {};
  await new Promise(resolve => {
    new THREE.TextureLoader().load(
      `assets/${name}_texture.jpg`,
      textureMap => {
        maps.map = textureMap;
        resolve();
      },
      null,
      resolve
    );
  });
  await new Promise(resolve => {
    new THREE.TextureLoader().load(
      `assets/${name}_normal.jpg`,
      normalMap => {
        maps.normalMap = normalMap;
        resolve();
      },
      null,
      resolve
    );
  });
  await new Promise(resolve => {
    new THREE.TextureLoader().load(
      `assets/${name}_bump.jpg`,
      bumpMap => {
        maps.bumpMap = bumpMap;
        maps.bumpScale = 0.06;
        resolve();
      },
      null,
      resolve
    );
  });
  await new Promise(resolve => {
    new THREE.TextureLoader().load(
      `assets/${name}_specular.jpg`,
      specularMap => {
        maps.specularMap = specularMap;
        resolve();
      },
      null,
      resolve
    );
  });

  let object = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshPhongMaterial(maps)
  );
  object.position.set(orbit.distance, 0, 0);
  group.add(object);

  if (moons) {
    for (let moon of moons) {
      let moonGroup = await createBody(...moon);
      moonGroup.position.set(orbit.distance, 0, 0);
      group.add(moonGroup);
    }
  }

  group.update = delta => {
    group.rotation.y += (2 * Math.PI * orbit.speed * delta) / (360 * 100);
  };

  return group;
}
