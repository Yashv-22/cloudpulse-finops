import boto3

def get_zombie_ebs_volumes():
    ec2 = boto3.resource('ec2', region_name='us-east-1')
    zombie_volumes = []
    
    # Filter for volumes that are 'available' (not attached to any instance)
    volumes = ec2.volumes.filter(Filters=[{'Name': 'status', 'Values': ['available']}])
    
    for vol in volumes:
        zombie_volumes.append({
            "id": vol.id,
            "size": vol.size,
            "type": vol.volume_type,
            "potential_savings": calculate_savings(vol.size, vol.volume_type)
        })
    return zombie_volumes

def calculate_savings(size, vol_type):
    # Rough estimate: $0.10 per GB for gp3
    return size * 0.10
