import bpy

# Open the saved blend file
blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Blender.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

scene = bpy.context.scene

# Use Cycles with 32 samples for fast crisp render
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.device = 'CPU'
scene.render.resolution_x = 960
scene.render.resolution_y = 1280
scene.render.resolution_percentage = 100

# Full body camera
full_cam = bpy.data.objects.get("FullBodyCamera")
if full_cam:
    scene.camera = full_cam
    scene.render.filepath = r"C:\Users\PERSONAL\Downloads\Denia\Denia_FullBody_Render.png"
    bpy.ops.render.render(write_still=True)
    print("Full body render complete!")

# Face camera
face_cam = bpy.data.objects.get("FaceCamera")
if face_cam:
    scene.camera = face_cam
    scene.render.filepath = r"C:\Users\PERSONAL\Downloads\Denia\Denia_FaceCloseup_Render.png"
    bpy.ops.render.render(write_still=True)
    print("Face closeup render complete!")

print("All renders finished successfully!")
