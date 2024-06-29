import * as THREE from "three";

import { ObjectProperties } from "./object-properties.js";
import { BooleanProperty, ColorProperty, DropdownProperty, PropertyGroup, ReadOnlyProperty, TextureProperty, ValueSliderProperty } from "./properties.js";

class MeshProperties extends ObjectProperties {
  constructor( editor, mesh ) {
    super( editor, mesh );

    this.mesh = mesh;

    this.geometryProperties = new PropertyGroup( this.container, "Geometry" );
    this.setupGeometryProperties( this.geometryProperties.content );

    this.materialProperties = new PropertyGroup( this.container, "Material" );
    this.setupMaterialProperties( this.materialProperties.content );

    this.physicsProperties = new PropertyGroup( this.container, "Physics" );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );

    this.eventManager.add( this.events.materialSelected, this.onMaterialSelected.bind( this ) );
    this.eventManager.add( this.events.materialChanged, this.onMaterialChanged.bind( this ) );
  }

  setupGeometryProperties( parent ) {
    const editor = this.editor;
    const object = this.mesh;
    const geometry = object.geometry;
    const params = geometry.parameters;

    this.geometryType = new ReadOnlyProperty( parent, "Type", geometry.type, "text");

    switch ( geometry.type ) {
      case "BoxGeometry":
        this.boxGeometryWidth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.width", "Width", params.width, 1, 30, 0.001 );
        this.boxGeometryHeight = new ValueSliderProperty( editor, parent, object, "geometry.parameters.height", "Height", params.height, 1, 30, 0.001 );
        this.boxGeometryDepth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.depth", "Depth", params.depth, 1, 30, 0.001 );
        this.boxGeometryWidthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.widthSegments", "Width Segments", params.widthSegments, 1, 10, 1 );
        this.boxGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 10, 1 );
        this.boxGeometryDepthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.depthSegments", "Depth Segments", params.depthSegments, 1, 10, 1 );

        break;

      case "PlaneGeometry":
        this.planeGeometryWidth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.width", "Width", params.width, 1, 30, 0.001 );
        this.planeGeometryHeight = new ValueSliderProperty( editor, parent, object, "geometry.parameters.height", "Height", params.height, 1, 30, 0.001 );
        this.planeGeometryWidthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.widthSegments", "Width Segments", params.widthSegments, 1, 30, 1 );
        this.planeGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 30, 1 );

        break;

      case "SphereGeometry":
        this.sphereGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 30, 0.001 );
        this.sphereGeometryWidthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.widthSegments", "Width Segments", params.widthSegments, 1, 64, 1 );
        this.sphereGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 32, 1 );

        break;

      case "CapsuleGeometry":
        this.capsuleGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 30, 0.001 );
        this.capsuleGeometryLength = new ValueSliderProperty( editor, parent, object, "geometry.parameters.length", "Length", params.length, 1, 30, 0.001 );
        this.capsuleGeometryCapSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.capSegments", "Cap Segments", params.capSegments, 1, 32, 1 );
        this.capsuleGeometryRadialSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radialSegments", "Radial Segments", params.capSegments, 1, 64, 1 );

        break;

      case "ConeGeometry":
        this.coneGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 0, 30, 0.01 );
        this.coneGeometryHeight = new ValueSliderProperty( editor, parent, object, "geometry.parameters.height", "Height", params.height, 1, 50, 0.001 );
        this.coneGeometryRadialSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radialSegments", "Radial Segments", params.radialSegments, 3, 64, 1 );
        this.coneGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 64, 1 );
        this.coneGeometryOpenEnded = new BooleanProperty( editor, parent, object, "geometry.parameters.openEnded", "Open Ended", params.openEnded );

        break;

      case "CircleGeometry":
        this.circleGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.circleGeometrySegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.segments", "Segments", params.segments, 0, 128, 1 );

        break;

      case "CylinderGeometry":
        this.cylinderGeometryRadiusBottom = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radiusBottom", "Radius Bottom", params.radiusBottom, 0, 30, 0.01 );
        this.cylinderGeometryRadiusTop = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radiusTop", "Radius Top", params.radiusTop, 0, 30, 0.01 );
        this.cylinderGeometryHeight = new ValueSliderProperty( editor, parent, object, "geometry.parameters.height", "Height", params.height, 1, 50, 0.001 );
        this.cylinderGeometryRadialSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radialSegments", "Radial Segments", params.radialSegments, 3, 64, 1 );
        this.cylinderGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 64, 1 );
        this.cylinderGeometryOpenEnded = new BooleanProperty( editor, parent, object, "geometry.parameters.openEnded", "Open Ended", params.openEnded );

        break;

      case "RingGeometry":
        this.ringGeometryInnerRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.innerRadius", "Inner Radius", params.innerRadius, 1, 30, 0.001 );
        this.ringGeometryOuterRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.outerRadius", "Outer Radius", params.outerRadius, 1, 30, 0.001 );
        this.ringGeometryThetaSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.thetaSegments", "Theta Segments", params.thetaSegments, 1, 3, 1 );
        this.ringGeometryPhiSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.phiSegments", "Phi Segments", params.phiSegments, 1, 30, 1 ); 

        break;

      case "TorusGeometry":
        this.torusGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.torusGeometryTube = new ValueSliderProperty( editor, parent, object, "geometry.parameters.tube", "Tube", params.tube, 0.1, 10, 0.001 );
        this.torusGeometryRadialSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radialSegments", "Radial Segments", params.radialSegments, 2, 30, 1 );
        this.torusGeometryTubularSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.tubularSegments", "Tubular Segments", params.tubularSegments, 3, 200, 1 );

        break;

      case "TorusKnotGeometry":
        this.torusKnotGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.torusKnotGeometryTube = new ValueSliderProperty( editor, parent, object, "geometry.parameters.tube", "Tube", params.tube, 0.1, 10, 0.0001 );
        this.torusKnotGeometryTubularSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.tubularSegments", "Tubular Segments", params.tubularSegments, 1, 300, 1 );
        this.torusKnotGeometryRadialSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radialSegments", "Radial Segments", params.radialSegments, 3, 20, 1 );
        this.torusKnotGeometryP = new ValueSliderProperty( editor, parent, object, "geometry.parameters.p", "P", params.p, 1, 20, 1 );
        this.torusKnotGeometryQ = new ValueSliderProperty( editor, parent, object, "geometry.parameters.q", "Q", params.q, 1, 20, 1 );

        break;

      case "DodecahedronGeometry":
        this.dodecahedronGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.dodecahedronGeometryDetail = new ValueSliderProperty( editor, parent, object, "geometry.parameters.detail", "Detail", params.detail, 0, 5, 1 );

        break;

      case "ExtrudeGeometry":
        this.extrudeGeometrySteps = new ValueSliderProperty( editor, parent, object, "geometry.parameters.steps", "Steps", params.steps, 1, 10, 1 );
        this.extrudeGeometryDepth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.depth", "Depth", params.depth, 1, 20, 0.001 );
        this.extrudeGeometryBevelThickness = new ValueSliderProperty( editor, parent, object, "geometry.parameters.bevelThickness", params.bevelThickness, 1, 5, 1 );
        this.extrudeGeometryBevelSize = new ValueSliderProperty( editor, parent, object, "geometry.parameters.bevelSize", params.bevelSize, 0, 5, 1 );
        this.extrudeGeometryBevelOffset = new ValueSliderProperty( editor, parent, object, "geometry.parameters.bevelOffset", params.bevelOffset, -4, 5, 1 );
        this.extrudeGeometryBevelSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.bevelSegments", params.bevelSegments, 1, 5, 1 );

        break;

      case "IcosahedronGeometry":
        this.icosahedronGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.icosahedronGeometryDetail = new ValueSliderProperty( editor, parent, object, "geometry.parameters.detail", "Detail", params.detail, 0, 5, 1 );

        break;

      case "LatheGeometry":
        this.latheGeometrySegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.segments", "Segments", params.segments, 1, 30, 1 );

        break;

      case "OctahedronGeometry":
        this.octahedronGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.octahedronGeometryDetail = new ValueSliderProperty( editor, parent, object, "geometry.parameters.detail", "Detail", params.detail, 0, 5, 1 );

        break;

      case "TetrahedronGeometry":
        this.tetrahedronGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 20, 0.001 );
        this.tetrahedronGeometryDetail = new ValueSliderProperty( editor, parent, object, "geometry.parameters.detail", "Detail", params.detail, 0, 5, 1 );

        break;

      case "TubeGeometry":
        this.tubeGeometrySegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.segments", "Segments", params.segments, 1, 100, 1 );
        this.tubeGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 10, 0.001 );
        this.tubeGeometryRadialSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radialSegments", "Radial Segments", params.radialSegments, 1, 20, 1 );

        break;
    }
  }

  setupMaterialProperties( parent ) {
    const editor = this.editor;
    const object = this.mesh;
    const material = object.material;

    this.materialTypes = new DropdownProperty( editor, parent, object, "material", "Type", {
      MeshBasicMaterial: "MeshBasicMaterial",
      MeshNormalMaterial: "MeshNormalMaterial",
      MeshPhongMaterial: "MeshPhongMaterial",
      MeshStandardMaterial: "MeshStandardMaterial",
      MeshDepthMaterial: "MeshDepthMaterial",
      MeshLambertMaterial: "MeshLambertMaterial",
      MeshMatcapMaterial: "MeshMatcapMaterial",
      MeshPhysicalMaterial: "MeshPhysicalMaterial",
      MeshToonMaterial: "MeshToonMaterial",
    }, material.type);

    this.materialTransparent = new BooleanProperty( editor, parent, object, "material.transparent", "Transparent", material.transparent );
    this.materialOpacity = new ValueSliderProperty( editor, parent, object, "material.opacity", "Opacity", material.opacity, 0, 1, 0.01 );
    this.materialDepthTest = new BooleanProperty( editor, parent, object, "material.depthTest", "Depth Test", material.depthTest );
    this.materialDepthWrite = new BooleanProperty( editor, parent, object, "material.depthWrite", "Depth Write", material.depthWrite );
    this.materialAlphaTest = new ValueSliderProperty( editor, parent, object, "material.alphaTest", "Alpha Test", material.alphaTest, 0, 1, 0.01 );
    this.materialAlphaHash = new BooleanProperty( editor, parent, object, "material.alphaHash", "Alpha Hash", material.alphaHash );
    this.materialVisible = new BooleanProperty( editor, parent, object, "material.visible", "Visible", material.visible );

    switch ( material.type ) {
      case "MeshBasicMaterial":
        this.basicMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.basicMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.basicMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.basicMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.basicMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.basicMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.basicMaterialCombine = new DropdownProperty( editor, parent, object, "material.combine", "Combine",
          {
            MultiplyOperation: THREE.MultiplyOperation,
            MixOperation: THREE.MixOperation,
            AddOperation: THREE.AddOperation,
          }, material.combine);
        this.basicMaterialReflectivity = new ValueSliderProperty( editor, parent, object, "material.reflectivity", "Reflectivity", material.reflectivity, 0, 1, 0.001 );
        this.basicMaterialRefactionRatio = new ValueSliderProperty( editor, parent, object, "material.refractionRatio", "Refraction Ratio", material.refractionRatio, 0, 1, 0.001 );

        break;
      case "MeshNormalMaterial":
        this.normalMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.normalMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );

        break;
      case "MeshPhongMaterial":
        this.phongMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.phongMaterialEmissive = new ColorProperty( editor, parent, object, "material.emissive", "Emissive", material.emissive );
        this.phongMaterialSpecular = new ColorProperty( editor, parent, object, "material.specular", "Specular", material.specular );
        this.phongMaterialShininess = new ValueSliderProperty( editor, parent, object, "material.shininess", "Shininess", material.shininess, 0, 100, 0.1 );
        this.phongMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.phongMaterialWireframe = new BooleanProperty ( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.phongMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.phongMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.phongMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.phongMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.phongMaterialCombine = new DropdownProperty( editor, parent, object, "material.combine", "Combine",
          {
            MultiplyOperation: THREE.MultiplyOperation,
            MixOperation: THREE.MixOperation,
            AddOperation: THREE.AddOperation,
          }, material.combine);
        this.phongMaterialReflectivity = new ValueSliderProperty( editor, parent, object, "material.reflectivity", "Reflectivity", material.reflectivity, 0, 1, 0.001 );
        this.phongMaterialRefractionRatio = new ValueSliderProperty( editor, parent, object, "material.refractionRatio", "Refraction Ratio", material.refractionRatio, 0, 1, 0.001 );

        break;
      case "MeshStandardMaterial":
        this.standardMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.standardMaterialEmissive = new ColorProperty( editor, parent, object, "material.emissive", "Emissive", material.emissive );
        this.standardMaterialRoughness = new ValueSliderProperty( editor, parent, object, "material.roughness", "Roughness", material.roughness, 0, 1, 0.001 );
        this.standardMaterialMetalness = new ValueSliderProperty( editor, parent, object, "material.metalness", "Metalness", material.metalness, 0, 1, 0.001 );
        this.standardMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.standardMaterialWireframe = new BooleanProperty ( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.standardMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.standardMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.standardMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.standardMaterialRoughnessMap = new TextureProperty( editor, parent, object, "material.roughnessMap", "Roughness Map", material.roughnessMap );
        this.standardMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.standardMaterialMetalnessMap = new TextureProperty( editor, parent, object, "material.metalnessMap", "Metalness Map", material.metalnessMap );

        break;
      case "MeshDepthMaterial":
        this.depthMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.depthMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );

        break;
      case "MeshLambertMaterial":
        this.lambertMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.lambertMaterialEmissive = new ColorProperty( editor, parent, object, "material.emissive", "Emissive", material.emissive );
        this.lambertMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.lambertMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.lambertMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.lambertMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.lambertMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.lambertMaterialCombine = new DropdownProperty( editor, parent, object, "material.combine", "Combine", 
          {
            MultiplyOperation: THREE.MultiplyOperation,
            MixOperation: THREE.MixOperation,
            AddOperation: THREE.AddOperation,
          }, material.combine);
        this.lambertMaterialReflectivity = new ValueSliderProperty( editor, parent, object, "material.reflectivity", "Reflectivity", material.reflectivity, 0, 1, 0.001 );
        this.lambertMaterialRefractionRatio = new ValueSliderProperty( editor, parent, object, "material.refractionRatio", "Refraction Ratio", material.refractionRatio, 0, 1, 0.001 );

        break;

      case "MeshMatcapMaterial":
        this.matcapMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.matcapMaterialflatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.matcapMaterialMatcap = new TextureProperty( editor, parent, object, "material.matcap", "Matcap", material.matcap );
        this.matcapMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );

        break;

      case "MeshPhysicalMaterial":
        this.physicalMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.physicalMaterialEmissive = new ColorProperty( editor, parent, object, "material.emissive", "Emissive", material.emissive );
        this.physicalMaterialRoughness = new ValueSliderProperty( editor, parent, object, "material.roughness", "Roughness", material.roughness, 0, 1, 0.001 );
        this.physicalMaterialMetalness = new ValueSliderProperty( editor, parent, object, "material.metalness", "Metalness", material.metalness, 0, 1, 0.001 );
        this.physicalMaterialIOR = new ValueSliderProperty( editor, parent, object, "material.ior", "IOR", material.ior, 1, 2.333, 0.000001 );
        this.physicalMaterialReflectivity = new ValueSliderProperty( editor, parent, object, "material.reflectivity", "Reflectivity", material.reflectivity, 0, 1, 0.000001 );
        this.physicalMaterialIridescence = new ValueSliderProperty( editor, parent, object, "material.iridescence", "Iridescence", material.iridescence, 0, 1, 0.001 );
        this.physicalMaterialIridescenceIOR = new ValueSliderProperty( editor, parent, object, "material.iridescenceIOR", "Iridescence IOR", material.iridescence, 1, 2.333, 0.000001 );
        this.physicalMaterialSheen = new ValueSliderProperty( editor, parent, object, "material.sheen", "Sheen", material.sheen, 0, 1, 0.001 );
        this.physicalMaterialSheenRoughness = new ValueSliderProperty( editor, parent, object, "material.sheenRoughness", "Sheen Roughness", material.sheenRoughness, 0, 1, 0.001 );
        this.physicalMaterialSheenColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.sheenColor );
        this.physicalMaterialClearcoat = new ValueSliderProperty( editor, parent, object, "material.clearcoat", "Clearcoat", material.clearcoat, 0, 1, 0.01 );
        this.physicalMaterialClearcoatRoughness = new ValueSliderProperty( editor, parent, object, "material.clearcoatRoughness", "Clearcoat Roughness", material.clearcoatRoughness, 0, 1, 0.01 );
        this.physicalMaterialSpecularIntensity = new ValueSliderProperty( editor, parent, object, "material.specularIntensity", "Specular Intensity", material.specularIntensity, 0, 1, 0.001 );
        this.physicalMaterialSpecularColor = new ColorProperty( editor, parent, object, "material.specularColor", "Specular Color", material.specularColor );
        this.physicalMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.physicalMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.physicalMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.physicalMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.physicalMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.physicalMaterialRoughnessMap = new TextureProperty( editor, parent, object, "material.roughnessMap", "Roughness Map", material.roughnessMap );
        this.physicalMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.physicalMaterialMetalnessMap = new TextureProperty( editor, parent, object, "material.metalnessMap", "Metalness Map", material.metalnessMap );
        this.physicalMaterialIridescenceMap = new TextureProperty( editor, parent, object, "material.iridescenceMap", "Iridescence Map", material.iridescenceMap );

        break;

      case "MeshToonMaterial":
        this.toonMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.toonMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.toonMaterialGradientMap = new TextureProperty( editor, parent, object, "material.gradientMap", "Gradient Map", material.gradientMap );
        this.toonMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );

        break;
    }
  }

  updateUI() {
    super.updateUI();

    const geometry = this.mesh.geometry;
    const params = geometry.parameters;
    this.setPropertyValue( this.geometryType, geometry.type );

    const geometryProps = this.getGeometryProperties( geometry.type );
    if ( geometryProps ) {
      for ( const prop in geometryProps ) {
        if ( params.hasOwnProperty( prop ) ) {
          this.setPropertyValue( geometryProps[ prop ], params[ prop ] );
        }
      }
    }

    const material = this.mesh.material;
    this.setPropertyValue( this.materialTypes, material.type );
    this.setPropertyValue( this.materialTransparent, material.transparent );
    this.setPropertyValue( this.materialOpacity, material.opacity );
    this.setPropertyValue( this.materialDepthTest, material.depthTest );
    this.setPropertyValue( this.materialDepthWrite, material.depthWrite );
    this.setPropertyValue( this.materialAlphaTest, material.alphaTest );
    this.setPropertyValue( this.materialAlphaHash, material.alphaHash );
    this.setPropertyValue( this.materialVisible, material.visible );

    const materialProps = this.getMaterialProperties( material.type );
    if ( materialProps ) {
      for ( const prop in materialProps ) {
        if ( material.hasOwnProperty( prop ) ) {
          this.setPropertyValue( materialProps[ prop ], material[ prop ] );
        }
      }
    }
  }

  // Helpers

  getGeometryProperties( geometryType = null ) {
    const geometryPropertiesMap = {
      BoxGeometry: {
        width: this.boxGeometryWidth,
        height: this.boxGeometryHeight,
        depth: this.boxGeometryDepth,
        widthSegments: this.boxGeometryWidthSegments,
        heightSegments: this.boxGeometryHeightSegments,
        depthSegments: this.boxGeometryDepthSegments,
      },
      PlaneGeometry: {
        width: this.planeGeometryWidth,
        height: this.planeGeometryHeight,
        widthSegments: this.planeGeometryWidthSegments,
        heightSegments: this.planeGeometryHeightSegments,
      },
      SphereGeometry: {
        radius: this.sphereGeometryRadius,
        widthSegments: this.sphereGeometryWidthSegments,
        heightSegments: this.sphereGeometryHeightSegments,
      },
      CapsuleGeometry: {
        radius: this.capsuleGeometryRadius,
        length: this.capsuleGeometryLength,
        capSegments: this.capsuleGeometryCapSegments,
        radialSegments: this.capsuleGeometryRadialSegments,
      },
      ConeGeometry: {
        radius: this.coneGeometryRadius,
        height: this.coneGeometryHeight,
        radialSegments: this.coneGeometryRadialSegments,
        heightSegments: this.coneGeometryHeightSegments,
        openEnded: this.coneGeometryOpenEnded,
      },
      CircleGeometry: {
        radius: this.circleGeometryRadius,
        segments: this.circleGeometrySegments,
      },
      CylinderGeometry: {
        radiusBottom: this.cylinderGeometryRadiusBottom,
        radiusTop: this.cylinderGeometryRadiusTop,
        height: this.cylinderGeometryHeight,
        radialSegments: this.cylinderGeometryRadialSegments,
        heightSegments: this.cylinderGeometryHeightSegments,
        openEnded: this.cylinderGeometryOpenEnded,
      },
      RingGeometry: {
        innerRadius: this.ringGeometryInnerRadius,
        outerRadius: this.ringGeometryOuterRadius,
        thetaSegments: this.ringGeometryThetaSegments,
        phiSegments: this.ringGeometryPhiSegments,
      },
      TorusGeometry: {
        radius: this.torusGeometryRadius,
        tube: this.torusGeometryTube,
        radialSegments: this.torusGeometryRadialSegments,
        tubularSegments: this.torusGeometryTubularSegments,
      },
      TorusKnotGeometry: {
        radius: this.torusKnotGeometryRadius,
        tube: this.torusKnotGeometryTube,
        tubularSegments: this.torusKnotGeometryTubularSegments,
        radialSegments: this.torusKnotGeometryRadialSegments,
        p: this.torusKnotGeometryP,
        q: this.torusKnotGeometryQ,
      },
      DodecahedronGeometry: {
        radius: this.dodecahedronGeometryRadius,
        detail: this.dodecahedronGeometryDetail,
      },
      ExtrudeGeometry: {
        steps: this.extrudeGeometrySteps,
        depth: this.extrudeGeometryDepth,
        bevelThickness: this.extrudeGeometryBevelThickness,
        bevelSize: this.extrudeGeometryBevelSize,
        bevelOffset: this.extrudeGeometryBevelOffset,
        bevelSegments: this.extrudeGeometryBevelSegments,
      },
      IcosahedronGeometry: {
        radius: this.icosahedronGeometryRadius,
        detail: this.icosahedronGeometryDetail,
      },
      LatheGeometry: {
        segments: this.latheGeometrySegments,
      },
      OctahedronGeometry: {
        radius: this.octahedronGeometryRadius,
        detail: this.octahedronGeometryDetail,
      },
      TetrahedronGeometry: {
        radius: this.tetrahedronGeometryRadius,
        detail: this.tetrahedronGeometryDetail,
      },
      TubeGeometry: {
        segments: this.tubeGeometrySegments,
        radius: this.tubeGeometryRadius,
        radialSegments: this.tubeGeometryRadialSegments,
      },
    };

    if ( !geometryType ) {
      return geometryPropertiesMap;
    }

    return geometryPropertiesMap[ geometryType ];
  }

  getMaterialProperties( materialType = null ) {
    const materialPropertiesMap = {
      MeshBasicMaterial: {
        color: this.basicMaterialColor,
        wireframe: this.basicMaterialWireframe,
        vertexColors: this.basicMaterialVertexColors,
        envMap: this.basicMaterialEnvMap,
        map: this.basicMaterialMap,
        alphaMap: this.basicMaterialAlphaMap,
        combine: this.basicMaterialCombine,
        reflectivity: this.basicMaterialReflectivity,
        refractionRatio: this.basicMaterialRefactionRatio,
      },
      MeshNormalMaterial: {
        flatShading: this.normalMaterialFlatShading,
        wireframe: this.normalMaterialWireframe,
      },
      MeshPhongMaterial: {
        color: this.phongMaterialColor,
        emissive: this.phongMaterialEmissive,
        specular: this.phongMaterialSpecular,
        shininess: this.phongMaterialShininess,
        flatShading: this.phongMaterialFlatShading,
        wireframe: this.phongMaterialWireframe,
        vertexColors: this.phongMaterialVertexColors,
        envMap: this.phongMaterialEnvMap,
        map: this.phongMaterialMap,
        alphaMap: this.phongMaterialAlphaMap,
        combine: this.phongMaterialCombine,
        reflectivity: this.phongMaterialReflectivity,
        refractionRatio: this.phongMaterialRefractionRatio,
      },
      MeshStandardMaterial: {
        color: this.standardMaterialColor,
        emissive: this.standardMaterialEmissive,
        roughness: this.standardMaterialRoughness,
        metalness: this.standardMaterialMetalness,
        flatShading: this.standardMaterialFlatShading,
        wireframe: this.standardMaterialWireframe,
        vertexColors: this.standardMaterialVertexColors,
        envMap: this.standardMaterialEnvMap,
        map: this.standardMaterialMap,
        roughnessMap: this.standardMaterialRoughnessMap,
        alphaMap: this.standardMaterialAlphaMap,
        metalnessMap: this.standardMaterialMetalnessMap,
      },
      MeshDepthMaterial: {
        flatShading: this.depthMaterialFlatShading,
        wireframe: this.depthMaterialWireframe,
      },
      MeshLambertMaterial: {
        color: this.lambertMaterialColor,
        emissive: this.lambertMaterialEmissive,
        wireframe: this.lambertMaterialWireframe,
        vertexColors: this.lambertMaterialVertexColors,
        envMap: this.lambertMaterialEnvMap,
        map: this.lambertMaterialMap,
        alphaMap: this.lambertMaterialAlphaMap,
        combine: this.lambertMaterialCombine,
        reflectivity: this.lambertMaterialReflectivity,
        refractionRatio: this.lambertMaterialRefractionRatio,
      },
      MeshMatcapMaterial: {
        color: this.matcapMaterialColor,
        flatShading: this.matcapMaterialflatShading,
        matcap: this.matcapMaterialMatcap,
        alphaMap: this.matcapMaterialAlphaMap,
      },
      MeshPhysicalMaterial: {
        color: this.physicalMaterialColor,
        emissive: this.physicalMaterialEmissive,
        roughness: this.physicalMaterialRoughness,
        metalness: this.physicalMaterialMetalness,
        ior: this.physicalMaterialIOR,
        reflectivity: this.physicalMaterialReflectivity,
        iridescence: this.physicalMaterialIridescence,
        iridescenceIOR: this.physicalMaterialIridescenceIOR,
        sheen: this.physicalMaterialSheen,
        sheenRoughness: this.physicalMaterialSheenRoughness,
        sheenColor: this.physicalMaterialSheenColor,
        clearcoat: this.physicalMaterialClearcoat,
        clearcoatRoughness: this.physicalMaterialClearcoatRoughness,
        specularIntensity: this.physicalMaterialSpecularIntensity,
        specularColor: this.physicalMaterialSpecularColor,
        flatShading: this.physicalMaterialFlatShading,
        wireframe: this.physicalMaterialWireframe,
        vertexColors: this.physicalMaterialVertexColors,
        envMap: this.physicalMaterialEnvMap,
        map: this.physicalMaterialMap,
        roughnessMap: this.physicalMaterialRoughnessMap,
        alphaMap: this.physicalMaterialAlphaMap,
        metalnessMap: this.physicalMaterialMetalnessMap,
        iridescenceMap: this.physicalMaterialIridescenceMap,
      },
      MeshToonMaterial: {
        color: this.toonMaterialColor,
        map: this.toonMaterialMap,
        gradientMap: this.toonMaterialGradientMap,
        alphaMap: this.toonMaterialAlphaMap,
      },
    };

    if ( !materialType ) {
      return materialPropertiesMap;
    }

    return materialPropertiesMap[ materialType ];
  }

  // Event handlers

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isMesh ) {
      this.mesh = object;
      this.updateUI();
    }
  }

  onMaterialSelected( event ) {
    this.materialProperties.clear();
    this.setupMaterialProperties( this.materialProperties.content );
  }

  onMaterialChanged( event ) {
    const object = event.detail.object;

    if ( object.isMesh ) {
      this.mesh = object;
      this.updateUI();
    }
  }
}

export { MeshProperties };
