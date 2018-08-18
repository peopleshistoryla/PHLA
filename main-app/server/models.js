var mongoose = require('mongoose')
var q = require("q");

var StoryContextSchema = mongoose.Schema(
    {
        references:[] ,//array of URLs,
        year: Number,
        text: String,
        credits: [], //array of strings (names)
    }
)

var StoryVideoSchema = mongoose.Schema(
    {
        url: String,
        credits: [], //array of strins (names)
    }
)

var StorySchema = mongoose.Schema(
    {
        location:[], //the geo index is here, [ long, lat ]
        title: String,
        video: StoryVideoSchema, // a video schema 1 to 1
        decade: Number,
        context: StoryContextSchema
    }
)


StorySchema.statics.createFromObj = function(data){

    let promise = q.defer();
    let new_story = new Story(data);
    new_story.save(function(err){
        if(err){
            return promise.reject(new Error("could not create and save new Story"))
        }

        return promise.resolve(new_story);
    });

    return promise.promise;
}

StorySchema.index({location: '2dsphere'})

const Story = mongoose.model('Story', StorySchema);

module.exports = Story;


