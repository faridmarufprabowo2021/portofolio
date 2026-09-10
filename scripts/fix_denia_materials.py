import bpy
import os

print("=== Fixing Denia Materials to Modern Anime Principled BSDF ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Posed.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

mesh = bpy.data.objects.get("Denia - (blue ver)_mesh")
if not mesh:
    raise RuntimeError("Mesh not found")

for mat in mesh.data.materials:
    if not mat or not mat.node_tree:
        continue
    
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Find the main diffuse texture image (first non-toon, non-spa texture)
    base_tex_node = None
    for n in nodes:
        if n.type == 'TEX_IMAGE' and n.image:
            img_name = n.image.name.lower()
            if not any(k in img_name for k in ['toon', 'spa', 'sink', 'sinnk', 'mc12']):
                base_tex_node = n
                break
    
    if not base_tex_node:
        # Fallback to any image
        for n in nodes:
            if n.type == 'TEX_IMAGE' and n.image:
                base_tex_node = n
                break
                
    if not base_tex_node:
        print(f"Skipping material with no texture: {mat.name}")
        continue
        
    print(f"Upgrading material: {mat.name} with texture: {base_tex_node.image.name}")
    
    # Store image reference
    tex_image = base_tex_node.image
    
    # Clear all existing nodes
    nodes.clear()
    
    # Create clean Principled BSDF & Output
    output_node = nodes.new(type='ShaderNodeOutputMaterial')
    output_node.location = (400, 0)
    
    principled_node = nodes.new(type='ShaderNodeBsdfPrincipled')
    principled_node.location = (100, 0)
    
    img_node = nodes.new(type='ShaderNodeTexImage')
    img_node.image = tex_image
    img_node.location = (-250, 0)
    
    # Texture coordinate & mapping
    uv_node = nodes.new(type='ShaderNodeTexCoord')
    uv_node.location = (-450, 0)
    links.new(uv_node.outputs['UV'], img_node.inputs['Vector'])
    
    # Connect Base Color
    links.new(img_node.outputs['Color'], principled_node.inputs['Base Color'])
    
    # Connect Alpha if texture has alpha
    links.new(img_node.outputs['Alpha'], principled_node.inputs['Alpha'])
    
    # Connect Surface
    links.new(principled_node.outputs['BSDF'], output_node.inputs['Surface'])
    
    # Adjust material properties based on type
    mat_lower = mat.name.lower()
    
    if 'face' in mat_lower or 'cheek' in mat_lower or 'nose' in mat_lower or 'kou' in mat_lower or 'she' in mat_lower:
        # Soft anime porcelain skin
        principled_node.inputs['Roughness'].default_value = 0.4
        principled_node.inputs['Specular IOR Level'].default_value = 0.15
        if 'cheek' in mat_lower:
            mat.blend_method = 'BLEND'
            principled_node.inputs['Roughness'].default_value = 1.0
            
    elif 'eye' in mat_lower or 'hi2' in mat_lower:
        # Sparkling anime eyes
        principled_node.inputs['Roughness'].default_value = 0.05
        principled_node.inputs['Specular IOR Level'].default_value = 0.9
        # Emission boost for crisp eye highlights
        if 'hi' in mat_lower:
            links.new(img_node.outputs['Color'], principled_node.inputs['Emission Color'])
            principled_node.inputs['Emission Strength'].default_value = 1.5
            mat.blend_method = 'BLEND'
            
    elif '发' in mat_lower or 'hair' in mat_lower or 'bang' in mat_lower:
        # Silky anime hair
        principled_node.inputs['Roughness'].default_value = 0.3
        principled_node.inputs['Specular IOR Level'].default_value = 0.4
        if '+' in mat.name:
            # Hair highlight layer
            mat.blend_method = 'BLEND'
            links.new(img_node.outputs['Color'], principled_node.inputs['Emission Color'])
            principled_node.inputs['Emission Strength'].default_value = 0.8
            
    elif '声痕' in mat_lower:
        # Glowing chest tacet mark tattoo
        links.new(img_node.outputs['Color'], principled_node.inputs['Emission Color'])
        principled_node.inputs['Emission Strength'].default_value = 3.0
        principled_node.inputs['Roughness'].default_value = 0.2
        
    elif '连衣裙' in mat_lower or 'blue' in mat_lower or '裙' in mat_lower or '手套' in mat_lower:
        # Rich silk dress & gloves
        principled_node.inputs['Roughness'].default_value = 0.35
        principled_node.inputs['Specular IOR Level'].default_value = 0.5
        
    else:
        principled_node.inputs['Roughness'].default_value = 0.35
        principled_node.inputs['Specular IOR Level'].default_value = 0.3

# Adjust Scene Lighting for Vibrant Anime Aesthetic
world = bpy.context.scene.world
if world and world.node_tree:
    bg = world.node_tree.nodes.get("Background")
    if bg:
        # Clean soft studio studio gray-blue gradient
        bg.inputs["Color"].default_value = (0.12, 0.14, 0.18, 1.0)
        bg.inputs["Strength"].default_value = 1.2

# Key Light (Warm soft sunlight)
key_l = bpy.data.objects.get("KeyLight")
if key_l:
    key_l.data.energy = 5.5
    key_l.data.color = (1.0, 0.98, 0.95)

# Fill Light (Cool sky ambient)
fill_l = bpy.data.objects.get("FillLight")
if fill_l:
    fill_l.data.energy = 3.5
    fill_l.data.color = (0.85, 0.92, 1.0)

# Rim Light (Crisp golden edge highlight)
rim_l = bpy.data.objects.get("RimLight")
if rim_l:
    rim_l.data.energy = 4.5
    rim_l.data.color = (1.0, 0.92, 0.75)

# Render Settings: EEVEE for True Anime Cel-Shaded Crispness or Clean Cycles
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 64
scene.cycles.device = 'CPU'
scene.render.resolution_x = 1080
scene.render.resolution_y = 1440
scene.render.resolution_percentage = 100

# Color Management: Standard sRGB with High Contrast for vibrant anime colors
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'Medium High Contrast'

# Save updated blend file
fixed_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_FixedAnime.blend"
bpy.ops.wm.save_as_mainfile(filepath=fixed_blend)
print("Saved fixed blend file to:", fixed_blend)

# Render Posed Full Body with Clean Anime Shaders
full_cam = bpy.data.objects.get("FullBodyCamera")
if full_cam:
    scene.camera = full_cam
    full_out = r"C:\Users\PERSONAL\Downloads\Denia\Denia_Anime_Fixed_FullBody.png"
    scene.render.filepath = full_out
    bpy.ops.render.render(write_still=True)
    print("Rendered Clean Anime Full Body:", full_out)

# Render Posed Portrait Close-Up with Clean Anime Shaders
face_cam = bpy.data.objects.get("FaceCamera")
if face_cam:
    scene.camera = face_cam
    face_out = r"C:\Users\PERSONAL\Downloads\Denia\Denia_Anime_Fixed_Portrait.png"
    scene.render.filepath = face_out
    bpy.ops.render.render(write_still=True)
    print("Rendered Clean Anime Portrait:", face_out)

print("=== Clean Anime Shader Pipeline Finished ===")
