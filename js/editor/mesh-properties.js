import * as THREE from "three";

import { ObjectProperties } from "./object-properties.js";
import { BooleanProperty, ColorProperty, DropdownProperty, PropertyGroup, ReadOnlyProperty, TextureProperty, ValueSliderProperty } from "./properties.js";

class MeshProperties extends ObjectProperties {
  constructor( editor, mesh ) {
    super( editor, mesh );
    this.mesh = mesh;

    this.geometryProperties = new PropertyGroup( this.container, "Geometry" );
    this.setupGeometryProperties( this.geometryProperties.container );

    this.materialProperties = new PropertyGroup( this.container, "Material" );
    this.setupMaterialProperties( this.materialProperties.container );

    this.physicsProperties = new PropertyGroup( this.container, "Physics" );

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.materialChanged.type,
      this.onMaterialChanged.bind( this )
    );
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
    }
  }

  setupMaterialProperties( parent ) {
    const editor = this.editor;
    const object = this.mesh;
    const material = object.material;

    this.materialTypes = new DropdownProperty( editor, parent, object, "material", "Type",
      [
        "MeshBasicMaterial",
        "MeshNormalMaterial",
        "MeshPhongMaterial",
        "MeshStandardMaterial",
      ],
      material.type);

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
          [
            THREE.MultiplyOperation,
            THREE.MixOperation,
            THREE.AddOperation
          ], material.combine);
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
          [
            THREE.MultiplyOperation,
            THREE.MixOperation,
            THREE.AddOperation
          ], material.combine);
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
    this.setPropertyValue( this.materialAlphaHash, material.alphaHas );
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
      // Add other geometry types as needed
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

  onMaterialChanged( event ) {
    this.materialProperties.clear();
    this.setupMaterialProperties( this.materialProperties.container );
  }
}

export { MeshProperties };
