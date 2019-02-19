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
  object.update = () => {};

  group.add(object);

  let light = new THREE.PointLight(0xffffff, 1, 0, 2);
  group.add(light);

  group.update = () => {};

  return group;
}

async function createBody(name, size, orbit, moons, rings) {
  let group = new THREE.Object3D();

  let objectMaps = {};
  await new Promise(resolve => {
    new THREE.TextureLoader().load(
      `assets/${name}_texture.jpg`,
      textureMap => {
        objectMaps.map = textureMap;
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
        objectMaps.normalMap = normalMap;
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
        objectMaps.bumpMap = bumpMap;
        objectMaps.bumpScale = 0.06;
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
        objectMaps.specularMap = specularMap;
        resolve();
      },
      null,
      resolve
    );
  });

  let object = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshPhongMaterial(objectMaps)
  );
  object.position.set(orbit.distance, 0, 0);
  object.update = delta => {
    object.rotation.y -= (2 * Math.PI * orbit.spinSpeed * delta) / (360 * 100);
  };

  group.add(object);

  let orbitGeometry = new THREE.Geometry();

  for (let i = 0; i < 2000; i++) {
    orbitGeometry.vertices.push(
      new THREE.Vector3(
        orbit.distance * Math.cos((2 * i * Math.PI) / 2000),
        0,
        orbit.distance * Math.sin((2 * i * Math.PI) / 2000)
      )
    );
  }

  let orbitLine = new THREE.Line(
    orbitGeometry,
    new THREE.LineBasicMaterial({
      color: 0x0000ff
    })
  );

  group.add(orbitLine);

  if (rings) {
    let ringMaps = {
      side: THREE.DoubleSide
    };

    await new Promise(resolve => {
      new THREE.TextureLoader().load(
        `assets/${name}_ring_texture.jpg`,
        textureMap => {
          console.log('here');
          ringMaps.map = textureMap;
          resolve();
        },
        null,
        resolve
      );
    });

    await new Promise(resolve => {
      new THREE.TextureLoader().load(
        `assets/${name}_ring_bump.jpg`,
        bumpMap => {
          console.log('here');
          ringMaps.bumpMap = bumpMap;
          ringMaps.bumpScale = 0.06;
          resolve();
        },
        null,
        resolve
      );
    });

    let ringsObject = new THREE.Mesh(
      new THREE.RingGeometry(rings.innerRadius, rings.outerRadius, 64),
      new THREE.MeshPhongMaterial(ringMaps)
    );
    ringsObject.rotation.x += Math.PI / 4;
    ringsObject.rotation.y += Math.PI / 4;
    ringsObject.rotation.z += rings.inclination;
    ringsObject.position.set(orbit.distance, 0, 0);
    ringsObject.update = () => {};

    group.add(ringsObject);
  }

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
