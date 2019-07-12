  //initialize scene
  let scene = new THREE.Scene();
  //initialize camera
  let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.x = 10;
  //set up orbit controls on the camera
  let controls = new THREE.OrbitControls(camera);
  //initialize renderer
  let renderer = new THREE.WebGLRenderer({antialias:true});
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var texload = new THREE.TextureLoader();

  renderer.setSize( window.innerWidth, window.innerHeight );
  //add renderer to the html page
  document.body.appendChild( renderer.domElement );

  var mUniforms = ({
    time : {type: 'f', value: 0},
    camPos : {type: 'v3', value: new THREE.Vector3(0,0,0)},
    camDir : {type: 'v3', value: new THREE.Vector3(0,0,-1)},
    camUp : {type: 'v3', value: new THREE.Vector3(0,0,-1)}
  });

  
  var mat = new THREE.ShaderMaterial ({
    uniforms : mUniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    side : THREE.DoubleSide,
    lights: false,
    transparent: true,
  });

  var planeGeo = new THREE.PlaneGeometry(100, 100, 100);
  var planeMesh = new THREE.Mesh(planeGeo, mat);
  planeMesh.position.z = -10;
  camera.add(planeMesh);

  scene.add(camera);

  var cameraWorldDir = new THREE.Vector3(0,0,1);
  var cameraWorldQuat = new THREE.Quaternion();


  var stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  const startTime = Date.now();

  let animate = function () {
    stats.begin();
    camera.getWorldDirection(cameraWorldDir)
    camera.getWorldQuaternion(cameraWorldQuat)
    var cameraUp = new THREE.Vector3(0,1,0).applyQuaternion(cameraWorldQuat);

    // planeMesh.position.x = camera.position.x;
    // planeMesh.position.y = camera.position.y;
    // planeMesh.position.z = camera.position.z;

    planeMesh.material.uniforms.camPos.value = camera.position;
    planeMesh.material.uniforms.camDir.value = cameraWorldDir;
    planeMesh.material.uniforms.camUp.value = cameraUp;
    planeMesh.material.uniforms.time.value = Date.now() - startTime;

    controls.update()
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
    stats.end()
  };

  animate();