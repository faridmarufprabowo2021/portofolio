import bpy
import json
import math

print("=== Running Detailed Archviz & 3D Interior Design Audit on Living Room Scene ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_LuxuryComplete.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

scene = bpy.context.scene

audit_data = {
    "scene_info": {
        "engine": scene.render.engine,
        "cycles_device": scene.cycles.device if hasattr(scene, 'cycles') else "N/A",
        "samples": scene.cycles.samples if hasattr(scene, 'cycles') else "N/A",
        "units": scene.unit_settings.length_unit,
    },
    "objects_summary": {
        "total_objects": len(scene.objects),
        "mesh_objects": len([o for o in scene.objects if o.type == 'MESH']),
        "light_objects": len([o for o in scene.objects if o.type == 'LIGHT']),
        "camera_objects": len([o for o in scene.objects if o.type == 'CAMERA']),
    },
    "collections": {},
    "ergonomic_dimensions": {},
    "materials": {},
    "lighting_analysis": {},
    "camera_composition": {},
}

# 1. Collections breakdown
for col in bpy.data.collections:
    audit_data["collections"][col.name] = [o.name for o in col.objects]

# 2. Key Ergonomic Dimensions Check (Metric Scale Validation)
key_objects = [
    "Floor", "Sofa_BaseFrame", "Seat_Cushion_1", "Sofa_Backrest", "CoffeeTable_Top",
    "TV_Cabinet_Frame", "SmartTV_GameScreen", "ArcLamp_Stem_V", "ArcLamp_DomeShade",
    "Knitted_Ottoman_Pouf", "PS5_Black_Core", "TV_Soundbar_Body"
]

for name in key_objects:
    obj = scene.objects.get(name)
    if obj:
        dim = obj.dimensions
        loc = obj.location
        audit_data["ergonomic_dimensions"][name] = {
            "location_xyz": [round(loc.x, 3), round(loc.y, 3), round(loc.z, 3)],
            "dimensions_xyz": [round(dim.x, 3), round(dim.y, 3), round(dim.z, 3)],
            "height_z": round(dim.z, 3),
        }

# 3. Materials audit
for mat in bpy.data.materials:
    if mat.use_nodes and mat.node_tree:
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bc = bsdf.inputs.get('Base Color')
            rough = bsdf.inputs.get('Roughness')
            met = bsdf.inputs.get('Metallic')
            em_c = bsdf.inputs.get('Emission Color')
            em_s = bsdf.inputs.get('Emission Strength')
            
            audit_data["materials"][mat.name] = {
                "base_color": [round(c, 2) for c in bc.default_value[:3]] if bc else None,
                "roughness": round(rough.default_value, 2) if rough else None,
                "metallic": round(met.default_value, 2) if met else None,
                "emission_strength": round(em_s.default_value, 1) if em_s else 0.0,
            }

# 4. Lighting analysis
for obj in scene.objects:
    if obj.type == 'LIGHT':
        l = obj.data
        audit_data["lighting_analysis"][obj.name] = {
            "type": l.type,
            "energy_watts": round(l.energy, 2),
            "color_rgb": [round(c, 2) for c in l.color[:3]],
            "location": [round(obj.location.x, 2), round(obj.location.y, 2), round(obj.location.z, 2)],
        }

# 5. Camera analysis
cam = scene.camera
if cam:
    audit_data["camera_composition"] = {
        "lens_focal_length_mm": cam.data.lens,
        "location": [round(cam.location.x, 2), round(cam.location.y, 2), round(cam.location.z, 2)],
        "rotation_deg": [round(math.degrees(cam.rotation_euler.x), 1), round(math.degrees(cam.rotation_euler.y), 1), round(math.degrees(cam.rotation_euler.z), 1)],
    }

out_json = r"C:\Users\PERSONAL\portfolio-farid\scripts\livingroom_audit_result.json"
with open(out_json, "w") as f:
    json.dump(audit_data, f, indent=2)

print(f"✅ AUDIT COMPLETED. Results saved to {out_json}")
